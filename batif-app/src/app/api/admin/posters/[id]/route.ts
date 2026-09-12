import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

// GET - Single poster
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images(*),
        product_colors(*),
        product_sizes(*),
        product_variants(*)
      `)
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 404 })
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH - Update poster
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServiceClient()
    const body = await request.json()

    const { images, colors, sizes, ...updates } = body

    // Ensure it stays as poster type
    updates.product_type = 'poster'

    // Update slug if name changed
    if (updates.name && !updates.slug) {
      updates.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
    }

    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Replace images if provided
    if (images !== undefined) {
      await supabase.from('product_images').delete().eq('product_id', id)
      if (images.length > 0) {
        const imageRows = images.map((img: any, idx: number) => ({
          product_id: id,
          url: img.url,
          image_type: img.image_type || (idx === 0 ? 'main' : 'gallery'),
          sort_order: idx,
        }))
        await supabase.from('product_images').insert(imageRows)
      }
    }

    // Replace sizes if provided
    if (sizes !== undefined) {
      await supabase.from('product_sizes').delete().eq('product_id', id)
      if (sizes.length > 0) {
        const sizeRows = sizes.map((s: any) => ({
          product_id: id,
          name: typeof s === 'string' ? s : s.name,
          price: typeof s === 'object' ? s.price : undefined,
        }))
        await supabase.from('product_sizes').insert(sizeRows)
      }
    }

    // Replace colors if provided
    if (colors !== undefined) {
      await supabase.from('product_colors').delete().eq('product_id', id)
      if (colors.length > 0) {
        const colorRows = colors.map((c: any) => ({
          product_id: id,
          name: typeof c === 'string' ? c : c.name,
          hex: typeof c === 'object' ? c.hex : '#000000',
        }))
        await supabase.from('product_colors').insert(colorRows)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE - Remove poster
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = createServiceClient()

    // Delete related data first
    await supabase.from('product_images').delete().eq('product_id', id)
    await supabase.from('product_colors').delete().eq('product_id', id)
    await supabase.from('product_sizes').delete().eq('product_id', id)
    await supabase.from('product_variants').delete().eq('product_id', id)

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
