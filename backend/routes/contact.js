const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  // Create transporter using environment variables
  // The user will need to supply EMAIL_USER and EMAIL_PASS in the backend .env
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'geniusappsolu@gmail.com', // fallback
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`, // sender address
    to: process.env.EMAIL_USER || 'geniusappsolu@gmail.com', // list of receivers
    replyTo: email,
    subject: `New Customer Enquiry from ${name}`, // Subject line
    text: `
      You have received a new message from your website contact form.
      
      Name: ${name}
      Email: ${email}
      Phone: ${phone || 'Not provided'}
      
      Message:
      ${message}
    `, 
    html: `
      <h3>New Customer Enquiry</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <hr/>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    if (!process.env.EMAIL_PASS) {
      console.warn("EMAIL_PASS is not set. Simulating successful email send for development.");
      return res.status(200).json({ message: 'Message successfully sent (simulated)' });
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message successfully sent' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
