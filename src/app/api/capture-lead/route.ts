import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Honeypot check (if 'website' field is filled, it's a bot)
    if (body.website) {
      return NextResponse.json({ success: true }); // Fake success for bots
    }

    const { email, companyName, role, teamSize, auditId, savings } = body;

    // Validate required fields
    if (!email || !auditId) {
      return NextResponse.json(
        { error: 'Email and audit ID are required' },
        { status: 400 }
      );
    }

    // Store lead in Supabase
    const { error: dbError } = await supabase.from('leads').insert({
      email,
      company_name: companyName || null,
      role: role || null,
      team_size: teamSize || null,
      audit_id: auditId,
      savings: savings,
    });

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      );
    }

    // Send confirmation email
    try {
      await resend.emails.send({
        from: 'AI Spend Audit <onboarding@resend.dev>', // Change to your verified domain
        to: email,
        subject: `Your AI Spend Audit Results - Save $${savings.toFixed(0)}/month`,
        html: generateEmailHTML(auditId, savings),
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateEmailHTML(auditId: string, savings: number): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const shareUrl = `${baseUrl}/audit/${auditId}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Your AI Spend Audit</h1>
        </div>
        
        <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #1f2937; margin-top: 0;">You Could Save $${savings.toFixed(0)}/month</h2>
          
          <p style="font-size: 16px; color: #4b5563;">
            Thanks for using our AI Spend Audit tool! Based on your current setup, we identified 
            opportunities to save <strong>$${savings.toFixed(0)} per month</strong> (that's 
            <strong>$${(savings * 12).toFixed(0)} per year</strong>).
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #1f2937;">View Your Full Report</h3>
            <p style="color: #6b7280; margin-bottom: 15px;">
              Access your detailed audit with personalized recommendations:
            </p>
            <a href="${shareUrl}" style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              View Full Audit
            </a>
          </div>

          ${savings >= 500 ? `
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #3b82f6;">
              <h3 style="margin-top: 0; color: #1e40af;">💰 High Savings Opportunity</h3>
              <p style="color: #1e40af; margin-bottom: 15px;">
                With over $500/month in potential savings, you're a great candidate for Credex's 
                discounted AI credits. We can help you save 20-40% on:
              </p>
              <ul style="color: #1e40af;">
                <li>Cursor Pro & Business plans</li>
                <li>Claude Team & Enterprise</li>
                <li>ChatGPT Team & Enterprise</li>
                <li>OpenAI & Anthropic API credits</li>
              </ul>
              <p style="color: #1e40af;">
                <strong>Our team will reach out within 24 hours</strong> with a personalized quote.
              </p>
            </div>
          ` : ''}

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="font-size: 14px; color: #6b7280; text-align: center;">
            Questions? Reply to this email or visit 
            <a href="https://credex.rocks" style="color: #667eea;">credex.rocks</a>
          </p>
        </div>
      </body>
    </html>
  `;
}