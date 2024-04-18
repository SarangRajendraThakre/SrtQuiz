const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswers: [String],
  questionType: String,
  timer: { type: Number, default: 10 }, // Add timer field with default value 10
  imagePath: String // Add imagePath field to store the image path for the question
});

const quizSchema = new mongoose.Schema({
  title: String,
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  posterImg: String,
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to the user who created the quiz
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
