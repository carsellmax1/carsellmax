import nodemailer from 'nodemailer';
import { emailConfig, deliverySettings } from './email-config';
import { getTemplateByType } from './email-templates';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    secure: emailConfig.secure,
    auth: emailConfig.auth,
    tls: {
      rejectUnauthorized: false, // For development, remove in production
    },
  });
};

// Rate limiting
const rateLimiter = {
  dailyCount: 0,
  hourlyCount: 0,
  lastReset: new Date(),
  
  canSend(): boolean {
    const now = new Date();
    const hoursSinceReset = (now.getTime() - this.lastReset.getTime()) / (1000 * 60 * 60);
    
    // Reset hourly counter every hour
    if (hoursSinceReset >= 1) {
      this.hourlyCount = 0;
      this.lastReset = now;
    }
    
    // Reset daily counter every 24 hours
    const daysSinceReset = hoursSinceReset / 24;
    if (daysSinceReset >= 1) {
      this.dailyCount = 0;
    }
    
    return this.dailyCount < emailConfig.dailyLimit && 
           this.hourlyCount < emailConfig.hourlyLimit;
  },
  
  recordSend(): void {
    this.dailyCount++;
    this.hourlyCount++;
  }
};

// Email sending function with retry logic
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  text?: string,
  attachments?: Array<{ filename: string; content: Buffer | string; contentType?: string }>
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  
  // Check rate limits
  if (!rateLimiter.canSend()) {
    return {
      success: false,
      error: 'Rate limit exceeded. Please try again later.'
    };
  }
  
  const transporter = createTransporter();
  
  // Verify connection
  try {
    await transporter.verify();
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return {
      success: false,
      error: 'SMTP connection failed. Check your credentials.'
    };
  }
  
  const mailOptions = {
    from: `${emailConfig.from.name} <${emailConfig.from.address}>`,
    to: to,
    replyTo: emailConfig.replyTo,
    subject: subject,
    html: html,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    attachments: attachments || [],
    headers: deliverySettings.headers,
  };
  
  // Retry logic
  for (let attempt = 1; attempt <= emailConfig.maxRetries; attempt++) {
    try {
      const result = await transporter.sendMail(mailOptions);
      rateLimiter.recordSend();
      
      console.log(`Email sent successfully (attempt ${attempt}):`, result.messageId);
      return {
        success: true,
        messageId: result.messageId
      };
      
    } catch (error: unknown) {
      console.error(`Email send attempt ${attempt} failed:`, error);
      
      if (attempt === emailConfig.maxRetries) {
        return {
          success: false,
          error: `Failed to send email after ${emailConfig.maxRetries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, emailConfig.retryDelay));
    }
  }
  
  return {
    success: false,
    error: 'Unexpected error in email sending'
  };
};

// Template-based email sending
export const sendOfferEmail = async (
  customerEmail: string,
  customerName: string,
  vehicleDetails: {
    year: number;
    make: string;
    model: string;
    mileage: number;
  },
  offerDetails: {
    amount: number;
    expiryDate: string;
    token: string;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  
  const template = getTemplateByType('offer_sent');
  if (!template) {
    return { success: false, error: 'Email template not found' };
  }

  const customerPortalUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/offer/${offerDetails.token}`;
  const vehicleSummary = `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model} with ${vehicleDetails.mileage.toLocaleString()} miles`;
  const offerAmount = `$${offerDetails.amount.toLocaleString()}`;
  const expiryDate = new Date(offerDetails.expiryDate).toLocaleDateString();

  // Replace placeholders in the template
  const htmlContent = template.html_content
    .replace(/{{customer_name}}/g, customerName)
    .replace(/{{vehicle_summary}}/g, vehicleSummary)
    .replace(/{{offer_amount}}/g, offerAmount)
    .replace(/{{expiry_date}}/g, expiryDate)
    .replace(/{{customer_portal_url}}/g, customerPortalUrl);

  const subject = template.subject.replace(/{{customer_name}}/g, customerName);
  
  return await sendEmail(customerEmail, subject, htmlContent);
};

// Submission confirmation email function
export const sendSubmissionConfirmationEmail = async (
  to: string,
  customerName: string,
  vehicleSummary: string,
  vehicleMileage: number,
  estimatedValue: string,
  submissionId: string,
  trackingUrl: string
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const template = getTemplateByType('submission_confirmation');
    if (!template) {
      throw new Error('Submission confirmation email template not found');
    }

    const html = template.html_content
      .replace(/\{\{customer_name\}\}/g, customerName)
      .replace(/\{\{vehicle_summary\}\}/g, vehicleSummary)
      .replace(/\{\{vehicle_mileage\}\}/g, vehicleMileage.toString())
      .replace(/\{\{estimated_value\}\}/g, estimatedValue)
      .replace(/\{\{submission_id\}\}/g, submissionId)
      .replace(/\{\{tracking_url\}\}/g, trackingUrl);

    return await sendEmail(to, template.subject, html);
  } catch (error) {
    console.error('Submission confirmation email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Test email function
export const sendTestEmail = async (to: string): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  const subject = 'Test Email from CarSellMax Admin';
  const html = `
    <h2>Test Email</h2>
    <p>This is a test email from CarSellMax Admin system.</p>
    <p>If you received this, the SMTP configuration is working correctly!</p>
    <p>Timestamp: ${new Date().toISOString()}</p>
  `;
  
  return await sendEmail(to, subject, html);
};
