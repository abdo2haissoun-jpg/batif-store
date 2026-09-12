import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET - List all posters
export async function GET(request: Request) {
  try {
    const supabase = createServiceClient()
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type') || 'poster'

    let query = supabase
      .from('products')
      .select(`
        *,
        product_images(*),
        product_colors(*),
        product_sizes(*),
        product_variants(*)
      `)
      .eq('product_type', type)
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST - Create a poster
export async function POST(request: Request) {
  try {
    const supabase = createServiceClient()
    const body = await request.json()

    const { images, colors, sizes, variants, ...productData } = body

    // Set product_type to poster
    productData.product_type = 'poster'

    // Generate slug from name
    if (!productData.slug && productData.name) {
      productData.slug = productData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single()

    if (productError) {
      return NextResponse.json({ error: productError.message }, { status: 500 })
    }

    // Insert images
    if (images && images.length > 0) {
      const imageRows = images.map((img: any, idx: number) => ({
        product_id: product.id,
        url: img.url,
        image_type: img.image_type || (idx === 0 ? 'main' : 'gallery'),
        sort_order: idx,
      }))
      await supabase.from('product_images').insert(imageRows)
    }

    // Insert sizes (poster dimensions like A1, A2, A3)
    if (sizes && sizes.length > 0) {
      const sizeRows = sizes.map((s: any) => ({
        product_id: product.id,
        name: typeof s === 'string' ? s : s.name,
        price: typeof s === 'object' ? s.price : undefined,
      }))
      await supabase.from('product_sizes').insert(sizeRows)
    }

    // Insert colors (optional for posters)
    if (colors && colors.length > 0) {
      const colorRows = colors.map((c: any) => ({
        product_id: product.id,
        name: typeof c === 'string' ? c : c.name,
        hex: typeof c === 'object' ? c.hex : '#000000',
      }))
      await supabase.from('product_colors').insert(colorRows)
    }

    return NextResponse.json({ data: product }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
