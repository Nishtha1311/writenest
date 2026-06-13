const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route GET /api/users  (admin only)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/users/:id/role  (admin only)
router.put('/:id/role', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// @route PUT /api/users/profile
router.put('/profile', protect, async (req, res, next) => {
  try {
    const { name, avatar, password } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (password) user.password = password;

    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
