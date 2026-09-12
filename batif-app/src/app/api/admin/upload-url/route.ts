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

/**
 * Returns a short-lived signed upload URL. The browser uploads the file
 * bytes directly to Supabase Storage with this URL — much faster than
 * proxying the file through this server.
 */
export async function POST(request: Request) {
  const isAuthed = await verifyAuth(request)
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { bucket = 'products', filename, contentType = 'image/jpeg' } = await request.json()

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json({ error: 'filename is required' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Make sure the bucket exists (first-run convenience)
    const { data: buckets } = await supabase.storage.listBuckets()
    const exists = buckets?.some(b => b.name === bucket || b.id === bucket)
    if (!exists) {
      const { error: createErr } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 15728640,
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      })
      if (createErr && !createErr.message?.includes('already exists')) {
        return NextResponse.json({ error: 'Storage bucket unavailable: ' + createErr.message }, { status: 500 })
      }
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filename)

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Could not sign upload URL' }, { status: 500 })
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}
