import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

async function verifyAuth(request: Request): Promise<boolean> {
  const cookieHeader = request.headers.get('cookie') || ''
  const authHeader = request.headers.get('authorization') || ''
  
  // Extract token from cookie
  const cookieMatch = cookieHeader.match(/sb-access-token=([^;\s]+)/)
  // Extract token from Authorization header
  const bearerMatch = authHeader.match(/Bearer\s+(.+)/i)
  
  const token = cookieMatch?.[1] || bearerMatch?.[1]
  
  if (!token) {
    console.log('[AUTH] No token found. Cookie:', cookieHeader.substring(0, 100), 'Auth:', authHeader.substring(0, 50))
    return false
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { 'apikey': ANON_KEY, 'Authorization': `Bearer ${token}` },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      console.log('[AUTH] Token rejected:', res.status, err.msg || err.message || 'unknown')
      return false
    }
    console.log('[AUTH] Token valid')
    return true
  } catch (err: any) {
    console.log('[AUTH] Network error:', err.message)
    return false
  }
}

export async function GET(request: Request) {
  const isAuthed = await verifyAuth(request)
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(*), product_colors(*), product_sizes(*), product_variants(*)')
    .order('created_at', { ascending: false })

  return NextResponse.json({ products: data || [] })
}

export async function POST(request: Request) {
  const isAuthed = await verifyAuth(request)
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  console.log('[PRODUCT POST] Creating:', body.name, 'slug:', slug)

  const supabase = createServiceClient()
  const { data, error } = await supabase.from('products').insert({
    name: body.name,
    slug,
    description: body.description || '',
    price: body.price,
    original_price: body.original_price || null,
    category: body.category || 'T-Shirts',
    material: body.material || '',
    fit: body.fit || '',
    care: body.care || '',
    sku: body.sku || '',
    status: body.status || 'draft',
    is_limited: body.is_limited || false,
    badge: body.badge || '',
  }).select().single()

  if (error) {
    console.error('[PRODUCT POST] Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('[PRODUCT POST] Created:', JSON.stringify(data))
  return NextResponse.json({ product: data })
}
