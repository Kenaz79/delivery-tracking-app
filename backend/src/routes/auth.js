const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// POST /api/auth/register
// body: { role, name, email, phone, password, universityId }
router.post('/register', async (req, res) => {
  try {
    const { role, name, email, phone, password, universityId } = req.body;

    if (!role || !name || !email || !password) {
      return res.status(400).json({ error: 'role, name, email and password are required' });
    }
    if (!['rider', 'customer', 'manager'].includes(role)) {
      return res.status(400).json({ error: 'role must be rider, customer or manager' });
    }
    if (role === 'rider' && !universityId) {
      return res.status(400).json({ error: 'universityId is required for riders (proof of enrolment)' });
    }

    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.createUser({ role, name, email, phone, passwordHash, universityId });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login
// body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    delete user.password_hash;
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

module.exports = router;
