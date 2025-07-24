const express = require('express');
const router = express.Router();
const Dress = require('../models/Dress');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/dresses/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all dresses
router.get('/', async (req, res) => {
  try {
    const dresses = await Dress.find();
    res.json(dresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new dress
router.post('/', upload.single('image'), async (req, res) => {
  const { name, category, price } = req.body;
  
  try {
    const newDress = new Dress({
      name,
      category,
      imageUrl: `/uploads/dresses/${req.file.filename}`,
      price
    });

    const savedDress = await newDress.save();
    res.status(201).json(savedDress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;