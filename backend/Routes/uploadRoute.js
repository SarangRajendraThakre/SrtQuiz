const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads"); // Specify the destination folder for uploads
  },
  filename: function (req, file, cb) {
    // Use a unique filename to prevent overwriting existing files
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});
const upload = multer({ storage: storage });

// POST route to handle image uploads
router.post("/", upload.single("image"), (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Send the file path in the response
    res.status(200).json({ imagePath: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
