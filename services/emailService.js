const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  auth: {
    user: process.env.EMAIL_USER || 'demo@ethereal.email',
    pass: process.env.EMAIL_PASS || 'demopassword'
  }
});

async function sendBookingConfirmationEmail(toEmail, booking, tour) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0077b6; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">WanderLust Tours</h1>
          <p style="margin: 5px 0 0; font-size: 14px;">Booking Confirmation</p>
        </div>
        <div style="padding: 24px; color: #333;">
          <h2>Thank You for Your Booking, ${booking.contactName}!</h2>
          <p>Your tour booking has been confirmed. Below are your booking details:</p>
          <div style="background: #f8f9fa; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p><strong>Booking Code:</strong> <span style="color: #0077b6; font-weight: bold;">${booking.bookingCode}</span></p>
            <p><strong>Tour Name:</strong> ${tour ? tour.name : 'Tour Package'}</p>
            <p><strong>Departure Date:</strong> ${booking.departureDate}</p>
            <p><strong>Guests:</strong> ${booking.guestCount}</p>
            <p><strong>Total Amount Paid:</strong> $${booking.finalAmount}</p>
          </div>
          <p>If you have any questions or need assistance, please contact our 24/7 support team.</p>
          <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard/bookings" style="display: inline-block; background-color: #0077b6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 12px;">View Booking Dashboard</a>
        </div>
        <div style="background-color: #f1f5f9; padding: 12px; text-align: center; font-size: 12px; color: #64748b;">
          &copy; 2026 WanderLust Tours. All rights reserved.
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"WanderLust Tours" <support@wanderlust.com>',
      to: toEmail,
      subject: `Booking Confirmation - ${booking.bookingCode} | WanderLust Tours`,
      html: htmlContent
    });

    console.log('Email sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
}

async function sendPasswordResetEmail(toEmail, resetUrl) {
  try {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #0077b6; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">WanderLust Tours</h1>
        </div>
        <div style="padding: 24px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #ff6b6b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"WanderLust Tours" <support@wanderlust.com>',
      to: toEmail,
      subject: 'Password Reset Request - WanderLust Tours',
      html: htmlContent
    });
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    return false;
  }
}

module.exports = {
  sendBookingConfirmationEmail,
  sendPasswordResetEmail
};
