const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Marix Support <noreply@marix.com>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, info };

  } catch (error) {
    // This stops the app from crashing and bubbles the error up to your controller
    console.error(`Email delivery failed: ${error.message}`);
    throw new Error('Email could not be sent. Please check your mail configurations.');
  }
};

module.exports = sendEmail;