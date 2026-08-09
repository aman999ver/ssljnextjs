const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, phone, password: hashedPassword, role: 'customer' });
    await user.save();

    const name = `${user.firstName} ${user.lastName}`;
    const token = jwt.sign({ id: user._id, role: user.role, name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const name = user.firstName ? `${user.firstName} ${user.lastName}` : "User";
    const token = jwt.sign({ id: user._id, role: user.role, name }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
