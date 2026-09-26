const { Resend } = require('resend');

const sendEmail = async (options) => {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: 'Marix Store <onboarding@resend.dev>', // Default sender for testing
      to: [options.email],
      subject: options.subject,
      html: options.html || `<p>${options.message}</p>`,
    });

    if (error) {
      console.error(`Email delivery failed: ${error.message}`);
      throw new Error('Email could not be sent. Please check your mail configurations.');
    }

    return { success: true, data };
  } catch (error) {
    console.error(`Email delivery failed: ${error.message}`);
    throw new Error('Email could not be sent. Please check your mail configurations.');
  }
};

module.exports = sendEmail;