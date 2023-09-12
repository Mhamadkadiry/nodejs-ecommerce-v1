const nodemailer = require("nodemailer");
// services can differ between gmail, mailgun, mailtrap, sendgrid ...
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // !secure => port = 587
    secure: true,
    auth: {
      user: process.env.SENDER_EMAIL,
      pass: process.env.SENDER_PASSWORD,
    },
  });

  const mailOpts = {
    from: "E-Commerce App",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOpts);
};
module.exports = sendEmail;
