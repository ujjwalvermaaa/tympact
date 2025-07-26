const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text');
const pug = require('pug');
const path = require('path');
const logger = require('../utils/logger');

// Email class to handle email sending
class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name ? user.name.split(' ')[0] : 'User';
    this.url = url;
    this.from = `Tympact <${process.env.EMAIL_FROM}>`;
  }

  // Create a transport
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Use SendGrid in production
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD,
        },
      });
    }

    // Use Mailtrap in development
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the actual email
  async send(template, subject, context = {}) {
    try {
      // 1) Render HTML based on a pug template
      const html = pug.renderFile(
        path.join(__dirname, `../views/emails/${template}.pug`),
        {
          firstName: this.firstName,
          url: this.url,
          subject,
          ...context,
        }
      );

      // 2) Define email options
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html,
        text: htmlToText(html),
      };

      // 3) Create a transport and send email
      await this.newTransport().sendMail(mailOptions);
    } catch (error) {
      logger.error('Error sending email:', error);
      throw error;
    }
  }

  // Welcome email
  async sendWelcome() {
    await this.send('welcome', 'Welcome to Tympact!');
  }

  // Password reset email
  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 minutes)'
    );
  }

  // Email verification
  async sendVerification() {
    await this.send(
      'verifyEmail',
      'Please verify your email address'
    );
  }

  // Email change notification
  async sendEmailChangeNotification() {
    await this.send(
      'emailChanged',
      'Your email has been updated'
    );
  }
}

// Function to send email (simplified interface)
const sendEmail = async (options) => {
  try {
    // In development, log the email instead of sending
    if (process.env.NODE_ENV === 'development') {
      logger.info('Email options:', JSON.stringify(options, null, 2));
      return;
    }

    // Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send mail with defined transport object
    await transporter.sendMail({
      from: `"Tympact" <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.text || '',
      html: options.html || '',
    });
  } catch (error) {
    logger.error('Error sending email:', error);
    throw error;
  }
};

module.exports = {
  Email,
  sendEmail,
};
