// Required environment variables: EMAIL_USER, EMAIL_PASS, EMAIL_SERVICE.
const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    const mailOptions = {
      from: `Marix Store <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    if (options.html) {
      mailOptions.html = options.html;
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };

  } catch (error) {
    // This stops the app from crashing and bubbles the error up to your controller
    console.error(`Email delivery failed: ${error.message}`);
    throw new Error('Email could not be sent. Please check your mail configurations.');
  }
};

module.exports = sendEmail;