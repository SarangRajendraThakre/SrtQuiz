const mongoose = require('mongoose');

const liveQuizSchema = new mongoose.Schema({
  roomCode: { type: String, required: true, unique: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  totalParticipants: { type: Number, default: 0 },
  users: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    answers: [{
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz.questions' },
      answer: String,
      isCorrect: Boolean
    }],
    totalScore: { type: Number, default: 0 }
  }]
});

const LiveQuiz = mongoose.model('LiveQuiz', liveQuizSchema);

module.exports = LiveQuiz;
