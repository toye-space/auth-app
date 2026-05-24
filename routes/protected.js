const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// === PROTECTED DASHBOARD ROUTE ===
router.get('/dashboard', authMiddleware, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}!`,
    user: req.user
  });
});

module.exports = router;