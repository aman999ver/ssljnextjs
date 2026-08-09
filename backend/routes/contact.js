const express = require('express');
const Enquiry = require('../models/Enquiry');

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  try {
    const newEnquiry = new Enquiry({ name, email, phone, message });
    await newEnquiry.save();
    
    res.status(200).json({ message: 'Enquiry saved successfully' });
  } catch (error) {
    console.error('Error saving enquiry:', error);
    res.status(500).json({ error: 'Failed to submit your enquiry. Please try again later.' });
  }
});

module.exports = router;
