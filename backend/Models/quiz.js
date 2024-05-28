const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswers: [String],
  questionType: String,
  timer: { type: Number, default: 20},
  imagePath: String
});

const quizSchema = new mongoose.Schema({
  title: String,
  description: String,
  visibility: { type: String, enum: ["public", "private"], default: "public" },
  posterImg: String,
  questions: [questionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String], // Adding tags field as an array of strings
  category: String // Adding category field as a string
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
