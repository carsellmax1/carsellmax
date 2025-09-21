export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  type: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: 'offer-sent',
    name: 'Offer Sent',
    subject: 'Your Car Offer - {{customer_name}}',
    html_content: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Car Offer</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .offer-box { background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .offer-amount { font-size: 2.5em; font-weight: bold; color: #10b981; margin: 10px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 0.9em; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CarSellMax Atlanta</h1>
            <p>Your Car Offer is Ready!</p>
          </div>
          
          <div class="content">
            <h2>Hello {{customer_name}},</h2>
            
            <p>Thank you for submitting your {{vehicle_summary}} for valuation. We've completed our analysis and are pleased to present you with the following offer:</p>
            
            <div class="offer-box">
              <h3>Our Offer</h3>
              <div class="offer-amount">{{offer_amount}}</div>
              <p>Valid until {{expiry_date}}</p>
            </div>
            
            <p>This offer is based on current market conditions and the condition of your vehicle. We believe this represents a fair and competitive price for your car.</p>
            
            <div style="text-align: center;">
              <a href="{{customer_portal_url}}" class="button">View Full Offer Details</a>
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>Review the offer details in your customer portal</li>
              <li>Accept or decline the offer</li>
              <li>If you accept, we'll schedule pickup within 24 hours</li>
              <li>Payment will be processed immediately upon vehicle inspection</li>
            </ul>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            The CarSellMax Atlanta Team</p>
          </div>
          
          <div class="footer">
            <p>CarSellMax Atlanta | 1234 Peachtree Street, Atlanta, GA 30309</p>
            <p>Phone: (404) 555-0123 | Email: offers@carsellmax.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    type: 'offer_sent',
    variables: ['customer_name', 'vehicle_summary', 'offer_amount', 'expiry_date', 'customer_portal_url'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'offer-reminder',
    name: 'Offer Reminder',
    subject: 'Reminder: Your Car Offer Expires Soon - {{customer_name}}',
    html_content: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offer Reminder</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .offer-box { background: white; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .offer-amount { font-size: 2.5em; font-weight: bold; color: #f59e0b; margin: 10px 0; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 0.9em; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CarSellMax Atlanta</h1>
            <p>⏰ Your Offer Expires Soon!</p>
          </div>
          
          <div class="content">
            <h2>Hello {{customer_name}},</h2>
            
            <p>This is a friendly reminder that your offer for your {{vehicle_summary}} will expire on {{expiry_date}}.</p>
            
            <div class="offer-box">
              <h3>Your Offer</h3>
              <div class="offer-amount">{{offer_amount}}</div>
              <p><strong>Expires: {{expiry_date}}</strong></p>
            </div>
            
            <p>Don't miss out on this competitive offer! We're ready to make the process quick and easy for you.</p>
            
            <div style="text-align: center;">
              <a href="{{customer_portal_url}}" class="button">Accept Offer Now</a>
            </div>
            
            <p>If you need more time or have questions, please contact us immediately.</p>
            
            <p>Best regards,<br>
            The CarSellMax Atlanta Team</p>
          </div>
          
          <div class="footer">
            <p>CarSellMax Atlanta | 1234 Peachtree Street, Atlanta, GA 30309</p>
            <p>Phone: (404) 555-0123 | Email: offers@carsellmax.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    type: 'offer_reminder',
    variables: ['customer_name', 'vehicle_summary', 'offer_amount', 'expiry_date', 'customer_portal_url'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'offer-accepted',
    name: 'Offer Accepted',
    subject: 'Congratulations! Your Offer Has Been Accepted - {{customer_name}}',
    html_content: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offer Accepted</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .success-box { background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .offer-amount { font-size: 2.5em; font-weight: bold; color: #10b981; margin: 10px 0; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 0.9em; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Congratulations!</h1>
            <p>Your Offer Has Been Accepted</p>
          </div>
          
          <div class="content">
            <h2>Hello {{customer_name}},</h2>
            
            <p>Great news! You've accepted our offer for your {{vehicle_summary}}.</p>
            
            <div class="success-box">
              <h3>Accepted Offer</h3>
              <div class="offer-amount">{{offer_amount}}</div>
              <p>We'll be in touch within 24 hours to schedule pickup</p>
            </div>
            
            <h3>Next Steps:</h3>
            <ul>
              <li>Our team will contact you within 24 hours to schedule pickup</li>
              <li>Please have your vehicle title and keys ready</li>
              <li>We'll perform a final inspection upon pickup</li>
              <li>Payment will be processed immediately after inspection</li>
            </ul>
            
            <p>Thank you for choosing CarSellMax Atlanta!</p>
            
            <p>Best regards,<br>
            The CarSellMax Atlanta Team</p>
          </div>
          
          <div class="footer">
            <p>CarSellMax Atlanta | 1234 Peachtree Street, Atlanta, GA 30309</p>
            <p>Phone: (404) 555-0123 | Email: offers@carsellmax.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    type: 'offer_accepted',
    variables: ['customer_name', 'vehicle_summary', 'offer_amount'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'offer-declined',
    name: 'Offer Declined',
    subject: 'Thank You for Your Interest - {{customer_name}}',
    html_content: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Offer Declined</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #6b7280; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 0.9em; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CarSellMax Atlanta</h1>
            <p>Thank You for Your Interest</p>
          </div>
          
          <div class="content">
            <h2>Hello {{customer_name}},</h2>
            
            <p>We understand that you've decided not to proceed with our offer for your {{vehicle_summary}} at this time.</p>
            
            <p>We respect your decision and want you to know that:</p>
            <ul>
              <li>Our offer remains valid for 30 days if you change your mind</li>
              <li>We're always here to help if you have any questions</li>
              <li>Market conditions may change, and we'd be happy to provide a new valuation</li>
            </ul>
            
            <p>If you decide to sell your vehicle in the future, please don't hesitate to contact us. We're committed to providing fair and competitive offers.</p>
            
            <p>Thank you for considering CarSellMax Atlanta.</p>
            
            <p>Best regards,<br>
            The CarSellMax Atlanta Team</p>
          </div>
          
          <div class="footer">
            <p>CarSellMax Atlanta | 1234 Peachtree Street, Atlanta, GA 30309</p>
            <p>Phone: (404) 555-0123 | Email: offers@carsellmax.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    type: 'offer_declined',
    variables: ['customer_name', 'vehicle_summary'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'need-photos',
    name: 'Need Photos',
    subject: 'Additional Photos Required - {{customer_name}}',
    html_content: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Additional Photos Required</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f59e0b; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 0.9em; color: #6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>CarSellMax Atlanta</h1>
            <p>Additional Photos Required</p>
          </div>
          
          <div class="content">
            <h2>Hello {{customer_name}},</h2>
            
            <p>Thank you for submitting your {{vehicle_summary}} for valuation. To provide you with the most accurate offer, we need some additional photos of your vehicle.</p>
            
            <h3>Required Photos:</h3>
            <ul>
              <li>Front view of the vehicle</li>
              <li>Rear view of the vehicle</li>
              <li>Driver's side view</li>
              <li>Passenger's side view</li>
              <li>Dashboard (showing odometer)</li>
              <li>Front seats</li>
              <li>Any damage or wear areas</li>
            </ul>
            
            <p>Please ensure photos are clear and well-lit. This will help us provide you with the most competitive offer possible.</p>
            
            <div style="text-align: center;">
              <a href="{{customer_portal_url}}" class="button">Upload Additional Photos</a>
            </div>
            
            <p>Once we receive the additional photos, we'll complete your valuation within 24 hours.</p>
            
            <p>Best regards,<br>
            The CarSellMax Atlanta Team</p>
          </div>
          
          <div class="footer">
            <p>CarSellMax Atlanta | 1234 Peachtree Street, Atlanta, GA 30309</p>
            <p>Phone: (404) 555-0123 | Email: offers@carsellmax.com</p>
          </div>
        </div>
      </body>
      </html>
    `,
    type: 'need_photos',
    variables: ['customer_name', 'vehicle_summary', 'customer_portal_url'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'submission-confirmation',
    name: 'Submission Confirmation',
    subject: 'Quote Submission Confirmed - {{customer_name}}',
    html_content: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quote Submission Confirmed</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px 20px; background: #f9fafb; }
          .success-box { background: white; border: 2px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 0.9em; color: #6b7280; }
          .step { display: flex; align-items: flex-start; margin: 15px 0; }
          .step-number { background: #10b981; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-right: 15px; flex-shrink: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Quote Submission Confirmed!</h1>
            <p>Thank you for choosing CarSellMax Atlanta</p>
          </div>
          
          <div class="content">
            <h2>Hello {{customer_name}},</h2>
            
            <p>We've successfully received your vehicle submission for your {{vehicle_summary}}. Our team is excited to review your vehicle and provide you with a competitive offer.</p>
            
            <div class="success-box">
              <h3>Submission Details</h3>
              <p><strong>Submission ID:</strong> {{submission_id}}</p>
              <p><strong>Vehicle:</strong> {{vehicle_summary}}</p>
              <p><strong>Mileage:</strong> {{vehicle_mileage}} miles</p>
              <p><strong>Estimated Value:</strong> {{estimated_value}}</p>
            </div>
            
            <h3>What Happens Next?</h3>
            
            <div class="step">
              <div class="step-number">1</div>
              <div>
                <strong>Review & Analysis (24 hours)</strong><br>
                Our expert team will carefully review your vehicle details, photos, and condition assessment.
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">2</div>
              <div>
                <strong>Final Valuation</strong><br>
                We'll provide you with a detailed valuation based on current market conditions and your vehicle's specific condition.
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">3</div>
              <div>
                <strong>Competitive Offer</strong><br>
                You'll receive your personalized offer via email with all the details you need to make an informed decision.
              </div>
            </div>
            
            <div class="step">
              <div class="step-number">4</div>
              <div>
                <strong>Quick & Easy Process</strong><br>
                If you accept our offer, we'll schedule pickup within 24 hours and process payment immediately.
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="{{tracking_url}}" class="button">Track My Quote Status</a>
            </div>
            
            <h3>Why Choose CarSellMax Atlanta?</h3>
            <ul>
              <li>✅ Fair, competitive offers based on real market data</li>
              <li>✅ Fast, hassle-free process</li>
              <li>✅ No hidden fees or surprises</li>
              <li>✅ Immediate payment upon vehicle inspection</li>
              <li>✅ Local Atlanta team with years of experience</li>
            </ul>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>
            The CarSellMax Atlanta Team</p>
          </div>
          
          <div class="footer">
            <p>CarSellMax Atlanta | 1234 Peachtree Street, Atlanta, GA 30309</p>
            <p>Phone: (404) 555-0123 | Email: quotes@carsellmax.com</p>
            <p>Track your quote: <a href="{{tracking_url}}">{{tracking_url}}</a></p>
          </div>
        </div>
      </body>
      </html>
    `,
    type: 'submission_confirmation',
    variables: ['customer_name', 'vehicle_summary', 'vehicle_mileage', 'estimated_value', 'submission_id', 'tracking_url'],
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function getTemplateByType(type: string): EmailTemplate | undefined {
  return defaultEmailTemplates.find(template => template.type === type);
}

export function getTemplateById(id: string): EmailTemplate | undefined {
  return defaultEmailTemplates.find(template => template.id === id);
}