import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function verifyAuth(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || ''
  const tokenMatch = cookieHeader.match(/sb-access-token=([^;]+)/)
  const authHeader = request.headers.get('authorization') || ''
  const bearerMatch = authHeader.match(/Bearer (.+)/)
  const token = tokenMatch?.[1] || bearerMatch?.[1]
  if (!token) return false
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` },
    })
    return res.ok
  } catch { return false }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthed = await verifyAuth(request)
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const supabase = createServiceClient()
  const { error } = await supabase.from('product_variants').update({ stock: body.stock }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
