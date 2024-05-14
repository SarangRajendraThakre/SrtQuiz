const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswers: [String],
  questionType: String,
  timer: { type: Number, default: 10 },
  imagePath: String
});

const quizSchema = new mongoose.Schema({
  title: String,
  description: String, // Adding a description field
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  posterImg: String,
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Adjust createdBy field to reference ObjectId
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
