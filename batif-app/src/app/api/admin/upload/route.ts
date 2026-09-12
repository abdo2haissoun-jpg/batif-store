import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function verifyAuth(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || ''
  const authHeader = request.headers.get('authorization') || ''
  const cookieMatch = cookieHeader.match(/sb-access-token=([^\s;]+)/)
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

    const supabase = createServiceClient()

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    // Try uploading — if bucket doesn't exist, create it and retry
    let { error } = await supabase.storage
      .from(bucket)
      .upload(filename, uint8Array, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      })

    if (error) {
      console.log('[UPLOAD] Upload failed, trying to create bucket:', error.message)
      const { error: createErr } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      })

      if (createErr && !createErr.message?.includes('already exists')) {
        console.error('[UPLOAD] Failed to create bucket:', createErr.message)
        return NextResponse.json({ error: 'Storage bucket not available: ' + createErr.message }, { status: 500 })
      }

      // Retry upload
      const retry = await supabase.storage
        .from(bucket)
        .upload(filename, uint8Array, {
          contentType: file.type || 'image/jpeg',
          upsert: true,
        })

      if (retry.error) {
        console.error('[UPLOAD] Retry failed:', retry.error.message)
        return NextResponse.json({ error: retry.error.message }, { status: 500 })
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filename)

    const publicUrl = urlData.publicUrl
    console.log(`[UPLOAD] Success: ${publicUrl}`)

    return NextResponse.json({ url: publicUrl, path: filename })
  } catch (err: any) {
    console.error('[UPLOAD] Error:', err.message || err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
