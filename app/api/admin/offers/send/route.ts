import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOfferEmail } from '@/lib/email-service';

const supabaseUrl = 'https://xjiymlzvbvjzdujvgcwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXltbHp2YnZqemR1anZnY3djIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgzMzgyODksImV4cCI6MjA3MzkxNDI4OX0.Sxuqx6dsSGnUHcLXsffdIocjpEuBdxHtDkJNA7PKZB0';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { offer_id, test_email } = body;

    if (!offer_id) {
      return NextResponse.json(
        { error: 'Offer ID is required' },
        { status: 400 }
      );
    }

    // Fetch offer with related data
    const { data: offer, error: offerError } = await supabase
      .from('offers')
      .select(`
        *,
        quote_submissions (
          id,
          status,
          customers (
            name,
            email,
            phone
          ),
          vehicles (
            make,
            model,
            year,
            vin,
            mileage,
            color,
            condition
          )
        )
      `)
      .eq('id', offer_id)
      .single();

    console.log('Send offer query result:', { offer, offerError });

    if (offerError || !offer) {
      console.error('Offer not found:', { offerError, offerId: offer_id });
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Prepare offer data for email
    const customer = offer.quote_submissions?.customers;
    const vehicle = offer.quote_submissions?.vehicles;

    if (!customer || !vehicle) {
      return NextResponse.json(
        { error: 'Customer or vehicle data not found' },
        { status: 500 }
      );
    }

    // Determine recipient email
    const recipientEmail = test_email || customer.email;

    try {
      // Send email using new SMTP service
      const result = await sendOfferEmail(
        recipientEmail,
        customer.name,
        {
          year: vehicle.year,
          make: vehicle.make,
          model: vehicle.model,
          mileage: vehicle.mileage
        },
        {
          amount: offer.offer_amount,
          expiryDate: offer.expiry_date,
          token: offer.tracking_token
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }

      const messageId = result.messageId;

      // Update offer status and record email send
      const { error: updateError } = await supabase
        .from('offers')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
          email_message_id: messageId,
          updated_at: new Date().toISOString()
        })
        .eq('id', offer_id);

      if (updateError) {
        console.error('Error updating offer status:', updateError);
        // Don't fail the request if we can't update the status
      }

      // Update quote submission status
      const { error: quoteUpdateError } = await supabase
        .from('quote_submissions')
        .update({
          status: 'quote_sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', offer.quote_submission_id);

      if (quoteUpdateError) {
        console.error('Error updating quote status:', quoteUpdateError);
      }

      // Log email send
      const { error: logError } = await supabase
        .from('email_logs')
        .insert([{
          offer_id: offer.id,
          recipient_email: recipientEmail,
          template_type: 'offer_sent',
          message_id: messageId,
          status: 'sent',
          sent_at: new Date().toISOString(),
          is_test: !!test_email
        }]);

      if (logError) {
        console.error('Error logging email send:', logError);
      }

      return NextResponse.json({ 
        data: { 
          messageId,
          recipient: recipientEmail,
          isTest: !!test_email
        } 
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please check Gmail configuration.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/admin/offers/send:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
