// routes/users.js
const express = require('express');
const router = express.Router();
const updateUserProfile = require('../models/updateUserProfile'); // ✅ clean import

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await updateUserProfile(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    console.error("Update error", err);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
