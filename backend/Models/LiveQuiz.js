// models/LiveQuiz.js (or wherever your LiveQuiz schema is defined)

const mongoose = require('mongoose');

// Define the schema for individual user answers
const userAnswerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Quiz.questions' // Reference to the question subdocument's _id
    },
    answer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    }
}, { _id: false }); // Do not create an _id for each answer subdocument

// Define the schema for participants in a live quiz
const liveQuizUserSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true, // Ensure a user only appears once in the users array
        ref: 'User' // Reference to the main User model
    },
    userName: { // <--- ADD THIS FIELD
        type: String,
        required: true
    },
    answers: [userAnswerSchema],
    totalScore: {
        type: Number,
        default: 0
    }
});

// Define the main LiveQuiz schema
const liveQuizSchema = new mongoose.Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Quiz'
    },
    totalParticipants: {
        type: Number,
        default: 0
    },
    users: [liveQuizUserSchema], // Array of participants
    // You might add a 'status' field (e.g., 'active', 'completed')
    // and 'createdAt', 'updatedAt' timestamps
}, { timestamps: true });

const LiveQuiz = mongoose.model('LiveQuiz', liveQuizSchema);

module.exports = LiveQuiz;