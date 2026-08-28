import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const FROM_EMAIL = process.env.FROM_EMAIL || 'BATIF Store <orders@resend.dev>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://batif-store.vercel.app'

// ─── Email templates ──────────────────────────────────────────────────────────
const STATUS_TEMPLATES: Record<string, { subject: string; html: string }> = {
  new: {
    subject: '🎉 Order Received - {order_number}',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; padding: 30px 40px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px;">BATIF</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #000000; font-size: 20px; font-weight: 400;">Order Received</h2>
          <p style="color: #666; line-height: 1.6;">Hi {customer_name},</p>
          <p style="color: #666; line-height: 1.6;">We've received your order <strong style="color: #000;">{order_number}</strong> and it's being processed.</p>
          <div style="background: #f8f8f8; padding: 20px; margin: 20px 0; border-left: 3px solid #FF5131;">
            <p style="margin: 5px 0; color: #333;"><strong>Order:</strong> {order_number}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Total:</strong> {total} MAD</p>
            <p style="margin: 5px 0; color: #333;"><strong>Payment:</strong> Cash on Delivery</p>
          </div>
          <p style="color: #666; line-height: 1.6;">We'll notify you when your order ships.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">© 2026 BATIF Store</p>
        </div>
      </div>
    `,
  },
  confirmed: {
    subject: '✅ Order Confirmed - {order_number}',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; padding: 30px 40px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px;">BATIF</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #000000; font-size: 20px; font-weight: 400;">Order Confirmed</h2>
          <p style="color: #666; line-height: 1.6;">Hi {customer_name},</p>
          <p style="color: #666; line-height: 1.6;">Great news! Your order <strong style="color: #000;">{order_number}</strong> has been confirmed and is being prepared.</p>
          <div style="background: #f8f8f8; padding: 20px; margin: 20px 0; border-left: 3px solid #FF5131;">
            <p style="margin: 5px 0; color: #333;"><strong>Order:</strong> {order_number}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Status:</strong> Confirmed ✓</p>
          </div>
          <p style="color: #666; line-height: 1.6;">We'll ship your order soon and send you tracking details.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">© 2026 BATIF Store</p>
        </div>
      </div>
    `,
  },
  shipped: {
    subject: '📦 Order Shipped - {order_number}',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; padding: 30px 40px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px;">BATIF</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #000000; font-size: 20px; font-weight: 400;">Order Shipped</h2>
          <p style="color: #666; line-height: 1.6;">Hi {customer_name},</p>
          <p style="color: #666; line-height: 1.6;">Your order <strong style="color: #000;">{order_number}</strong> is on its way!</p>
          <div style="background: #f8f8f8; padding: 20px; margin: 20px 0; border-left: 3px solid #FF5131;">
            <p style="margin: 5px 0; color: #333;"><strong>Order:</strong> {order_number}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Status:</strong> Shipped 📦</p>
            <p style="margin: 5px 0; color: #333;"><strong>Delivery:</strong> 2-5 business days</p>
          </div>
          <p style="color: #666; line-height: 1.6;">Please have the cash ready for payment on delivery.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">© 2026 BATIF Store</p>
        </div>
      </div>
    `,
  },
  delivered: {
    subject: '🎉 Order Delivered - {order_number}',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; padding: 30px 40px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px;">BATIF</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #000000; font-size: 20px; font-weight: 400;">Order Delivered</h2>
          <p style="color: #666; line-height: 1.6;">Hi {customer_name},</p>
          <p style="color: #666; line-height: 1.6;">Your order <strong style="color: #000;">{order_number}</strong> has been delivered!</p>
          <div style="background: #f8f8f8; padding: 20px; margin: 20px 0; border-left: 3px solid #FF5131;">
            <p style="margin: 5px 0; color: #333;"><strong>Order:</strong> {order_number}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Status:</strong> Delivered ✓</p>
          </div>
          <p style="color: #666; line-height: 1.6;">Thank you for shopping with BATIF! We hope you love your new pieces.</p>
          <p style="color: #666; line-height: 1.6;">If you have any issues, contact us anytime.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">© 2026 BATIF Store</p>
        </div>
      </div>
    `,
  },
  cancelled: {
    subject: '❌ Order Cancelled - {order_number}',
    html: `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: #000000; padding: 30px 40px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 300; letter-spacing: 2px;">BATIF</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="color: #000000; font-size: 20px; font-weight: 400;">Order Cancelled</h2>
          <p style="color: #666; line-height: 1.6;">Hi {customer_name},</p>
          <p style="color: #666; line-height: 1.6;">Your order <strong style="color: #000;">{order_number}</strong> has been cancelled.</p>
          <div style="background: #f8f8f8; padding: 20px; margin: 20px 0; border-left: 3px solid #ccc;">
            <p style="margin: 5px 0; color: #333;"><strong>Order:</strong> {order_number}</p>
            <p style="margin: 5px 0; color: #333;"><strong>Status:</strong> Cancelled</p>
          </div>
          <p style="color: #666; line-height: 1.6;">If you have questions, please contact us.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">© 2026 BATIF Store</p>
        </div>
      </div>
    `,
  },
}

// ─── Email sender ─────────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.log('[EMAIL] Resend API key not configured, skipping')
    return { success: false, error: 'Email not configured' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [to],
        subject,
        html,
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error('[EMAIL] Send failed:', JSON.stringify(data))
      return { success: false, error: data.message || data.error || 'Send failed' }
    }

    console.log('[EMAIL] Sent to', to, '- ID:', data.id)
    return { success: true, id: data.id }
  } catch (err: any) {
    console.error('[EMAIL] Error:', err.message)
    return { success: false, error: err.message }
  }
}

// ─── Template filler (simple string replace) ───────────────────────────────────
function fillTemplate(template: string, vars: Record<string, string>) {
  let result = template
  for (const [key, value] of Object.entries(vars)) {
    // Simple replace of {key} with value
    result = result.split(`{${key}}`).join(value)
  }
  return result
}

// ─── API route: POST /api/admin/orders/status ─────────────────────────────────
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { order_id, status } = body

    if (!order_id || !status) {
      return NextResponse.json({ error: 'Missing order_id or status' }, { status: 400 })
    }

    const validStatuses = ['new', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const supabase = createServiceClient()

    // Get current order details
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (fetchError || !order) {
      console.error('[STATUS] Order fetch failed:', fetchError)
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Update status
    const { data: updated, error: updateError } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', order_id)
      .select()
      .single()

    if (updateError) {
      console.error('[STATUS] Update failed:', JSON.stringify(updateError))
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    console.log(`[STATUS] Updated ${order.order_number} to "${status}"`)

    // Send email notification (non-blocking)
    let emailResult = { success: false, error: 'No email' as string | null }
    const customerEmail = order.customer_email
    const template = STATUS_TEMPLATES[status]

    if (customerEmail && template) {
      const vars = {
        customer_name: order.customer_name || 'Customer',
        order_number: order.order_number || 'BT-00000',
        total: String(order.total || 0),
        status,
      }

      const subject = fillTemplate(template.subject, vars)
      const html = fillTemplate(template.html, vars)

      emailResult = await sendEmail(customerEmail, subject, html)
      console.log(`[STATUS] Email result:`, emailResult)
    } else if (!customerEmail) {
      emailResult = { success: false, error: 'No customer email' }
      console.log(`[STATUS] No email for order ${order.order_number}`)
    } else if (!template) {
      emailResult = { success: false, error: 'No template for status' }
    }

    return NextResponse.json({
      success: true,
      order: updated,
      email_sent: emailResult.success,
      email_error: emailResult.error,
    })
  } catch (err: any) {
    console.error('[STATUS] Error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
