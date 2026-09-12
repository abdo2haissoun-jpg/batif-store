import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createServiceClient()

    // Add product_type column if not exists
    const { error: alterError } = await supabase.rpc('exec_sql' as any, {
      query: `ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'clothing'`
    }).then(() => ({ error: null })).catch(() => ({ error: 'rpc not available' }))

    // Try direct approach via REST
    // Actually, we can't run DDL through the JS client. Let's try a different approach.
    // We'll just set product_type on products that don't have it via update
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ product_type: 'clothing' })
      .is('product_type', null)

    if (updateError) {
      // Column might not exist yet - let's check by trying to select it
      const { error: checkError } = await supabase
        .from('products')
        .select('product_type')
        .limit(1)
      
      if (checkError) {
        return NextResponse.json({
          success: false,
          error: 'product_type column does not exist. Please add it manually in Supabase SQL Editor.',
          sql: `ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'clothing';`
        }, { status: 500 })
      }
      
      return NextResponse.json({
        success: false,
        error: 'Column exists but update failed',
        details: updateError.message
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'product_type column ready' })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
