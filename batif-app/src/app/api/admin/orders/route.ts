import { NextResponse } from 'next/server'
import { adminGetAllOrders } from '@/lib/supabase/queries'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function verifyAuth(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || ''
  const tokenMatch = cookieHeader.match("sb-access-token=([^;]+)")
  if (!tokenMatch) return false
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${tokenMatch[1]}` },
    })
    return res.ok
  } catch { return false }
}

export async function GET(request: Request) {
  const isAuthed = await verifyAuth(request)
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = await adminGetAllOrders()
  return NextResponse.json({ orders })
}
