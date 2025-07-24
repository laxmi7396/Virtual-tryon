const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Dress = require('../models/Dress');
const multer = require('multer');
const path = require('path');

// Configure multer for user image uploads
const userImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/users/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadUserImage = multer({ storage: userImageStorage });

// Save try-on result
router.post('/:userId/save-outfit', uploadUserImage.single('resultImage'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { dressId } = req.body;
    
    user.savedOutfits.push({
      userImage: `/uploads/users/${req.file.filename}`,
      dressId,
      resultImage: `/uploads/users/${req.file.filename}`
    });

    await user.save();
    res.json(user.savedOutfits);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get user's saved outfits
router.get('/:userId/outfits', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('savedOutfits.dressId');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.savedOutfits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;