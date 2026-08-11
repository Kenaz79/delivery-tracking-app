const express = require('express');
const User = require('../models/User');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/users/me
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// GET /api/users/riders — for the management dashboard
router.get('/riders', requireAuth, requireRole('manager'), async (req, res) => {
  const riders = await User.listByRole('rider');
  res.json(riders);
});

module.exports = router;
