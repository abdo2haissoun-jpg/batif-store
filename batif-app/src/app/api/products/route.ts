import { NextResponse } from 'next/server'
import { getPublishedProducts } from '@/lib/supabase/queries'

export async function GET() {
  const products = await getPublishedProducts()
  return NextResponse.json({ products })
}
