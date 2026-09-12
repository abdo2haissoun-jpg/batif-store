/**
 * Client-side image compression + fast direct-to-Supabase uploads.
 *
 * Strategy:
 * 1. Compress/resize images in the browser with canvas (huge win: most phone
 *    photos are 5–15MB, we cut them to ~200–500KB before any network transfer)
 * 2. Get short-lived signed upload URLs from our API (tiny request, no file data)
 * 3. Upload the compressed bytes straight to Supabase Storage from the browser,
 *    in parallel — the file never passes through Vercel.
 */

export interface UploadResult {
  url: string
  path: string
}

const MAX_DIMENSION = 1800
const JPEG_QUALITY = 0.85

/** Compress an image file in the browser. Returns a Blob ready for upload. */
export async function compressImage(file: File): Promise<Blob> {
  // Skip compression for small files or non-image types
  if (file.size < 400 * 1024 || !file.type.startsWith('image/')) {
    return file
  }

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file

    // White background so transparent PNGs don't turn black as JPEG
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close()

    return await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob && blob.size < file.size ? blob : file),
        'image/jpeg',
        JPEG_QUALITY
      )
    })
  } catch {
    // If compression fails for any reason, upload the original
    return file
  }
}

/** Ask our API for a signed upload URL (fast — no file data involved). */
async function getSignedUploadUrl(
  bucket: string,
  filename: string,
  contentType: string
): Promise<{ signedUrl: string; path: string; token: string }> {
  const token = sessionStorage.getItem('batif_admin_token') || ''
  const res = await fetch('/api/admin/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bucket, filename, contentType }),
  })
  const data = await res.json()
  if (!res.ok || !data.signedUrl) {
    throw new Error(data.error || 'Could not create upload URL')
  }
  return data
}

/**
 * Compress then upload one file directly to Supabase.
 * Returns the public URL of the uploaded image.
 */
export async function fastUploadImage(
  file: File,
  bucket = 'products',
  folder = 'posters'
): Promise<UploadResult> {
  const compressed = await compressImage(file)

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { signedUrl } = await getSignedUploadUrl(bucket, filename, compressed.type || 'image/jpeg')

  const uploadRes = await fetch(signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': compressed.type || 'image/jpeg' },
    body: compressed,
  })

  if (!uploadRes.ok) {
    const errText = await uploadRes.text().catch(() => uploadRes.statusText)
    throw new Error(`Upload failed: ${errText}`)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return {
    url: `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`,
    path: filename,
  }
}

/** Upload many files in parallel with a concurrency cap. Reports per-file progress. */
export async function fastUploadMany(
  files: File[],
  bucket = 'products',
  folder = 'posters',
  onOneDone?: (done: number, total: number) => void
): Promise<{ results: UploadResult[]; errors: string[] }> {
  const results: UploadResult[] = []
  const errors: string[] = []
  let done = 0

  const CONCURRENCY = 3
  const queue = [...files]

  const worker = async () => {
    while (queue.length > 0) {
      const file = queue.shift()
      if (!file) break
      try {
        results.push(await fastUploadImage(file, bucket, folder))
      } catch (err: any) {
        errors.push(`${file.name}: ${err.message}`)
      }
      done++
      onOneDone?.(done, files.length)
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  // Keep upload order stable
  results.sort((a, b) => a.path.localeCompare(b.path))
  return { results, errors }
}
