import { NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function verifyAuth(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || ''
  const authHeader = request.headers.get('authorization') || ''
  const cookieMatch = cookieHeader.match(/sb-access-token=([^;\s]+)/)
  const bearerMatch = authHeader.match(/Bearer\s+(.+)/i)
  const token = cookieMatch?.[1] || bearerMatch?.[1]
  if (!token) return false
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` },
    })
    return res.ok
  } catch { return false }
}

async function ensureBucket(bucketName: string): Promise<boolean> {
  // List existing buckets
  const listRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
    },
  })

  if (listRes.ok) {
    const buckets = await listRes.json()
    const exists = buckets.some((b: any) => b.id === bucketName || b.name === bucketName)
    if (exists) return true
  }

  // Create the bucket
  console.log(`[UPLOAD] Creating bucket: ${bucketName}`)
  const createRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: bucketName,
      name: bucketName,
      public: true,
      file_size_limit: 10485760, // 10MB
      allowed_mime_types: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
    }),
  })

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({ message: createRes.statusText }))
    console.error('[UPLOAD] Failed to create bucket:', err.message || err)
    return false
  }

  console.log(`[UPLOAD] Bucket created: ${bucketName}`)
  return true
}

export async function POST(request: Request) {
  const isAuthed = await verifyAuth(request)
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const bucket = (formData.get('bucket') as string) || 'products'
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    console.log(`[UPLOAD] File: ${file.name}, Size: ${file.size}, Type: ${file.type}`)

    // Ensure bucket exists
    const bucketReady = await ensureBucket(bucket)
    if (!bucketReady) {
      return NextResponse.json({ error: 'Storage bucket not available' }, { status: 500 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${filename}`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': file.type || 'image/jpeg',
        'x-upsert': 'true',
      },
      body: uint8Array,
    })

    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({ message: uploadRes.statusText }))
      console.error('[UPLOAD] Storage error:', err.message || err)
      return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
    }

    // Get public URL
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filename}`
    console.log(`[UPLOAD] Success: ${publicUrl}`)

    return NextResponse.json({ url: publicUrl, path: filename })
  } catch (err: any) {
    console.error('[UPLOAD] Error:', err.message || err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
