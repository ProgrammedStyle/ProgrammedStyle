const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configure Gmail Transporter
const gmailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

/**
 * Send email using SendGrid as primary method
 * Falls back to Gmail if SendGrid fails
 */
async function sendEmail({ to, subject, text, html }) {
  const fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.GMAIL_USER;
  
  // Try SendGrid first
  try {
    console.log('Attempting to send email via SendGrid...');
    
    const msg = {
      to,
      from: fromEmail,
      subject,
      text,
      html
    };
    
    await sgMail.send(msg);
    console.log('✓ Email sent successfully via SendGrid');
    return { success: true, method: 'SendGrid' };
    
  } catch (sendGridError) {
    console.error('✗ SendGrid failed:', sendGridError.message);
    
    // Fallback to Gmail
    try {
      console.log('Attempting to send email via Gmail...');
      
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to,
        subject,
        text,
        html
      };
      
      await gmailTransporter.sendMail(mailOptions);
      console.log('✓ Email sent successfully via Gmail (fallback)');
      return { success: true, method: 'Gmail (fallback)' };
      
    } catch (gmailError) {
      console.error('✗ Gmail fallback also failed:', gmailError.message);
      throw new Error(`Email sending failed: ${gmailError.message}`);
    }
  }
}

/**
 * Send contact form notification to admin
 */
async function sendContactNotification(contactData) {
  const subject = `New Contact Form Submission: ${contactData.subject}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #059669; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${contactData.name}</div>
          </div>
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${contactData.email}</div>
          </div>
          ${contactData.phone ? `
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${contactData.phone}</div>
          </div>
          ` : ''}
          <div class="field">
            <div class="label">Subject:</div>
            <div class="value">${contactData.subject}</div>
          </div>
          <div class="field">
            <div class="label">Message:</div>
            <div class="value">${contactData.message}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    New Contact Form Submission
    
    Name: ${contactData.name}
    Email: ${contactData.email}
    ${contactData.phone ? `Phone: ${contactData.phone}` : ''}
    Subject: ${contactData.subject}
    Message: ${contactData.message}
  `;
  
  return await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject,
    text,
    html
  });
}

/**
 * Send auto-reply to user
 */
async function sendContactAutoReply(contactData) {
  const subject = 'Thank you for contacting us!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank You for Reaching Out!</h2>
        </div>
        <div class="content">
          <p>Hi ${contactData.name},</p>
          <p>Thank you for contacting ProgrammedStyle. We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your submission details:</strong></p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p>We typically respond within 24 hours during business days.</p>
          <p>Best regards,<br>The ProgrammedStyle Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Hi ${contactData.name},
    
    Thank you for contacting ProgrammedStyle. We have received your message and will get back to you as soon as possible.
    
    Your submission details:
    Subject: ${contactData.subject}
    
    We typically respond within 24 hours during business days.
    
    Best regards,
    The ProgrammedStyle Team
  `;
  
  return await sendEmail({
    to: contactData.email,
    subject,
    text,
    html
  });
}

module.exports = {
  sendEmail,
  sendContactNotification,
  sendContactAutoReply
};

