const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL || "cloudinary://125893293816666:OLEZhHlE0uDJxfx9-Q4PJSQMPhM@huqzbsak"
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'subhalaxmi',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const upload = multer({ storage: storage });

router.use(authMiddleware, adminMiddleware);

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ url: req.file.path });
  } catch (error) {
    res.status(500).json({ error: 'Image upload failed' });
  }
});

module.exports = router;
