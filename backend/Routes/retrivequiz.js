// retrievquiz.js

const express = require("express");
const router = express.Router();
const Quiz = require("../Models/quiz");

// Route to fetch all quizzes
router.get("/api/getquiz", async (req, res) => {
  try {
    const quizzes = await Quiz.find();
    res.json({ quizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
