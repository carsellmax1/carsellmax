// Gmail SMTP Configuration
export const emailConfig = {
  // Gmail SMTP Settings
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER || 'carsellmax1@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || '', // App Password, not regular password
  },
  
  // Email Settings
  from: {
    name: 'CarSellMax Atlanta',
    address: process.env.GMAIL_USER || 'carsellmax1@gmail.com',
  },
  
  // Reply-to settings
  replyTo: process.env.GMAIL_USER || 'carsellmax1@gmail.com',
  
  // Rate limiting (Gmail has daily limits)
  dailyLimit: 500, // Gmail free tier limit
  hourlyLimit: 100, // Conservative hourly limit
  
  // Retry settings
  maxRetries: 3,
  retryDelay: 5000, // 5 seconds
};

// Email templates configuration
export const emailTemplates = {
  offerSent: {
    subject: 'Your Car Quote is Ready - CarSellMax Atlanta',
    priority: 'high',
  },
  offerReminder: {
    subject: 'Reminder: Your Car Quote Expires Soon - CarSellMax Atlanta',
    priority: 'normal',
  },
  offerAccepted: {
    subject: 'Congratulations! Your Car Sale is Confirmed - CarSellMax Atlanta',
    priority: 'high',
  },
  offerDeclined: {
    subject: 'Thank You for Considering CarSellMax Atlanta',
    priority: 'normal',
  },
  needPhotos: {
    subject: 'Additional Photos Needed for Your Car Quote - CarSellMax Atlanta',
    priority: 'normal',
  },
};

// Gmail delivery best practices
export const deliverySettings = {
  // Use proper headers for better deliverability
  headers: {
    'X-Mailer': 'CarSellMax-Admin/1.0',
    'X-Priority': '3',
    'X-MSMail-Priority': 'Normal',
    'Importance': 'Normal',
  },
  
  // DKIM and SPF will be handled by Gmail automatically
  // Make sure your domain has proper SPF record: v=spf1 include:_spf.google.com ~all
  
  // Avoid spam triggers
  avoidSpamTriggers: {
    noAllCaps: true,
    noExcessivePunctuation: true,
    noSpamWords: true,
    properSubjectLength: true,
  },
};
