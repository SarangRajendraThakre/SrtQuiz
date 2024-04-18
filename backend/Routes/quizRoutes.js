const express = require("express");
const router = express.Router();
const quizController = require('../Controllers/quizController');

// GET quizzes by user ID
router.get('/quizzes/:userId', quizController.getQuizzesByUserId);

// GET quiz by quiz ID
router.get('/quizzes/quiz/:quizId', quizController.getQuizById);

// GET quiz by title
router.get('/quizzes/title/:title', quizController.getQuizByTitle);

// POST a new quiz
router.post('/quizzes', quizController.createQuiz);

// POST a new question to a quiz
router.post('/add-question', quizController.addQuestionToQuiz);

module.exports = router;
