import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

// Gmail OAuth2 configuration
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Set credentials if we have a refresh token
if (process.env.GOOGLE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });
}

export const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface OfferData {
  customer_name: string;
  customer_email: string;
  vehicle_summary: string;
  valuation_value: number;
  offer_amount: number;
  expiry_date: string;
  offer_id: string;
  tracking_token: string;
  customer_portal_url: string;
}

export function mergeEmailTemplate(template: EmailTemplate, data: OfferData): EmailTemplate {
  const variables = {
    '{{customer_name}}': data.customer_name,
    '{{vehicle_summary}}': data.vehicle_summary,
    '{{valuation_value}}': `$${data.valuation_value.toLocaleString()}`,
    '{{offer_amount}}': `$${data.offer_amount.toLocaleString()}`,
    '{{expiry_date}}': data.expiry_date,
    '{{offer_id}}': data.offer_id,
    '{{tracking_token}}': data.tracking_token,
    '{{customer_portal_url}}': data.customer_portal_url,
  };

  let mergedSubject = template.subject;
  let mergedHtml = template.html;
  let mergedText = template.text;

  Object.entries(variables).forEach(([placeholder, value]) => {
    mergedSubject = mergedSubject.replace(new RegExp(placeholder, 'g'), value);
    mergedHtml = mergedHtml.replace(new RegExp(placeholder, 'g'), value);
    mergedText = mergedText.replace(new RegExp(placeholder, 'g'), value);
  });

  return {
    subject: mergedSubject,
    html: mergedHtml,
    text: mergedText
  };
}

export async function sendEmail(to: string, template: EmailTemplate, data: OfferData): Promise<string> {
  try {
    const mergedTemplate = mergeEmailTemplate(template, data);
    
    // Create email message

    // Convert to Gmail format
    const emailLines = [
      `To: ${to}`,
      `Subject: ${mergedTemplate.subject}`,
      'Content-Type: text/html; charset=utf-8',
      '',
      mergedTemplate.html
    ];

    const email = emailLines.join('\n');
    const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    // Send email
    const response = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedEmail
      }
    });

    return response.data.id || '';
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

export function generateTrackingToken(): string {
  return Buffer.from(Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

