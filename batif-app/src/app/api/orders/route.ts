import { NextRequest, NextResponse } from 'next/server'
import { createOrder } from '@/lib/supabase/queries'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_name, phone, email, city, address, postal_code, note, items, subtotal, delivery_fee, total } = body

    // Validate required fields
    if (!customer_name || !phone || !city || !address || !items?.length) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate items - accept either color_id/size_id or color/size strings
    for (const item of items) {
      if (!item.product_id || !item.quantity || !item.unit_price) {
        return NextResponse.json(
          { error: 'Invalid item data - need product_id, quantity, unit_price' },
          { status: 400 }
        )
      }
      // Ensure color and size strings exist
      if (!item.color && !item.color_id) item.color = 'Standard'
      if (!item.size && !item.size_id) item.size = 'M'
      if (!item.product_name) item.product_name = 'Product'
    }

    const result = await createOrder({
      customer_name,
      phone,
      email: email || null,
      city,
      address,
      postal_code,
      note,
      items: items.map((item: any) => ({
        product_id: item.product_id,
        product_name: item.product_name || 'Product',
        color: item.color || 'Standard',
        size: item.size || 'M',
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
      subtotal: subtotal || 0,
      delivery_fee: delivery_fee || 0,
      total: total || 0,
    })

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ order: result.order }, { status: 201 })
  } catch (error: any) {
    console.error('[ORDER] Creation error:', error.message || error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
