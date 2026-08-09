const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, authMiddleware } = require('../middleware/auth');

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

router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect old password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
});
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;
    // In a real app, verify the Google token using google-auth-library.
    // For now, assume the client sends the decoded payload (email, name, picture, sub).
    const { email, name, sub } = req.body.payload; 

    if (!email) return res.status(400).json({ error: 'Email required' });

    let user = await User.findOne({ email });
    if (!user) {
      // Register new user via Google
      const names = name ? name.split(' ') : ['User', ''];
      user = new User({
        firstName: names[0],
        lastName: names.slice(1).join(' ') || '',
        email: email,
        password: await bcrypt.hash(sub || Math.random().toString(), 10), // dummy pass
        role: 'customer'
      });
      await user.save();
    }

    const userName = `${user.firstName} ${user.lastName}`;
    const jwtToken = jwt.sign({ id: user._id, role: user.role, name: userName }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token: jwtToken, user: { id: user._id, name: userName, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Google login failed' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});
module.exports = router;
