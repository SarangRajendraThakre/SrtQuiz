const express = require("express");
const router = express.Router();
const quizController = require('../Controllers/quizController');

// GET quizzes by user ID
router.get('/quizzes/:userId', quizController.getQuizzesByUserId);

// GET quiz by quiz ID
router.get('/quizzes/quiz/:quizId', quizController.getQuizById);

// GET quiz by title
router.get('/quizzes/title/:title', quizController.getQuizByTitle);

// GET question by question ID
router.get('/questions/:questionId', quizController.getQuestionById);

// POST a new quiz
router.post('/quizzes', quizController.createQuiz);

// POST a new question to a quiz
router.post('/add-question', quizController.addQuestionToQuiz);

// PUT (update) a question by question ID
router.put('/questions/update/:questionId', quizController.updateQuestionById);

// DELETE a question by question ID
router.delete('/questions/delete/:questionId', quizController.deleteQuestionById);

module.exports = router;
