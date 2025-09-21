# Gmail SMTP Setup Guide for CarSellMax

This guide will help you configure Gmail SMTP for reliable email delivery in the CarSellMax admin system.

## 🚀 Quick Setup (5 minutes)

### Step 1: Google Account Configuration

1. **Enable 2-Step Verification**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click "2-Step Verification" and follow the setup process
   - This is **required** to generate App Passwords

2. **Generate App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" as the app
   - Select "Other" as the device
   - Name it "CarSellMax Admin"
   - **Copy the 16-character password** (you won't see it again!)

### Step 2: Environment Configuration

Create or update your `.env.local` file with these variables:

```bash
# Gmail SMTP Configuration
GMAIL_USER=quotes@carsellmax.com
GMAIL_APP_PASSWORD=your_16_character_app_password_here

# SMTP Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_AUTH=true

# Your existing variables...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SERPAPI_KEY=your_serpapi_key
OPENAI_API_KEY=your_openai_key
```

### Step 3: Test Email Delivery

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to Email Test page:**
   - Go to `http://localhost:3000/admin/email-test`
   - Enter your email address
   - Click "Send Test Email"

3. **Check your inbox:**
   - Look for the test email
   - Check spam folder if not in inbox
   - Verify the sender shows as "CarSellMax Atlanta"

## 📧 Email Delivery Best Practices

### Gmail Limits
- **Free Gmail**: 500 emails per day
- **Google Workspace**: 2,000 emails per day
- **Rate limit**: ~100 emails per hour (conservative)

### Deliverability Tips

1. **Use a Professional Email Address**
   - `quotes@carsellmax.com` (recommended)
   - Avoid personal Gmail addresses for business

2. **Set Up SPF Record**
   Add this to your domain's DNS:
   ```
   v=spf1 include:_spf.google.com ~all
   ```

3. **Monitor Sending Patterns**
   - Don't send too many emails at once
   - Spread sends throughout the day
   - Monitor bounce rates

## 🔧 Troubleshooting

### Common Issues

**"Authentication failed"**
- Double-check your App Password (16 characters)
- Ensure 2-Step Verification is enabled
- Verify the email address is correct

**"Connection timeout"**
- Check your internet connection
- Verify SMTP settings (smtp.gmail.com:587)
- Try port 465 with secure: true

**"Emails going to spam"**
- Set up SPF record
- Use professional sender name
- Avoid spam trigger words
- Monitor sending volume

**"Rate limit exceeded"**
- Wait 1 hour before sending more
- Reduce sending frequency
- Consider upgrading to Google Workspace

### Testing Checklist

- [ ] 2-Step Verification enabled
- [ ] App Password generated and saved
- [ ] Environment variables set correctly
- [ ] Development server restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox (not spam)
- [ ] Sender name displays correctly

## 📊 Monitoring Email Delivery

### Email Logs
The system automatically logs all email sends in the `email_logs` table:
- Message ID for tracking
- Recipient email
- Send status
- Timestamp
- Template type

### Rate Limiting
Built-in rate limiting prevents exceeding Gmail limits:
- Daily limit: 500 emails
- Hourly limit: 100 emails
- Automatic retry with backoff

## 🚀 Production Deployment

### Environment Variables
Set these in your production environment:
```bash
GMAIL_USER=quotes@carsellmax.com
GMAIL_APP_PASSWORD=your_production_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

### Domain Configuration
1. **Set up SPF record** in your DNS
2. **Configure DKIM** (handled by Gmail)
3. **Monitor delivery rates** in Gmail Admin Console

### Scaling Considerations
- For high volume (>500/day), consider:
  - Google Workspace upgrade
  - Dedicated email service (SendGrid, Mailgun)
  - Multiple Gmail accounts with rotation

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify all environment variables
3. Test with a simple email first
4. Check Gmail Admin Console for delivery issues

---

**Inshallah, your email delivery will work perfectly!** 🎉

