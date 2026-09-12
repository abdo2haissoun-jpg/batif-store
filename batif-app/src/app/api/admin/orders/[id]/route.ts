import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
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

/**
 * GET - Full order detail including items with product images.
 * Also accepts ?order_number=BT-12345 as an alternative lookup.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthed = await verifyAuth(request)
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params

  const supabase = createServiceClient()

  // Lookup by UUID id or by order_number
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  const { data: order, error } = isUuid
    ? await supabase.from('orders').select('*').eq('id', id).single()
    : await supabase.from('orders').select('*').eq('order_number', id).single()

  if (error || !order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

  // Fetch items joined with product info (images, sku, material)
  const { data: items } = await supabase
    .from('order_items')
    .select(`
      *,
      product:products(
        id,
        name,
        sku,
        slug,
        material,
        product_images(url, image_type, sort_order)
      )
    `)
    .eq('order_id', order.id)

  // Sort images so main is first, and build a clean items array
  const cleanItems = (items || []).map(item => {
    const images = (item.product?.product_images || []).slice().sort(
      (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    const mainImage =
      images.find((i: any) => i.image_type === 'main')?.url ||
      images[0]?.url ||
      null

    return {
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_slug: item.product?.slug || null,
      image: mainImage,
      sku: item.product?.sku || null,
      material: item.product?.material || null,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total: item.total,
    }
  })

  return NextResponse.json({ order, items: cleanItems })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const isAuthed = await verifyAuth(request)
  if (!isAuthed) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const supabase = createServiceClient()
  if (body.status) {
    const { error } = await supabase.from('orders').update({ status: body.status }).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
