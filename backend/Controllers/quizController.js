const Quiz = require("../Models/quiz");

// Get quizzes by user ID
exports.getQuizzesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const quizzes = await Quiz.find({ createdBy: userId });
    res.status(200).json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get quiz by quiz ID
exports.getQuizById = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get quiz by title
exports.getQuizByTitle = async (req, res) => {
  try {
    const title = req.params.title;
    const quiz = await Quiz.findOne({ title });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create a new quiz
exports.createQuiz = async (req, res) => {
  try {
    // Extract quiz data from request body
    const { title, visibility, folder, posterImg, createdBy } = req.body;
    const quiz = new Quiz({
      title,
      visibility,
      folder,
      posterImg,
      createdBy
    });

    // Save the new quiz to the database
    const newQuiz = await quiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a new question to a quiz
exports.addQuestionToQuiz = async (req, res) => {
  try {
    // Extract question data from request body
    const { quizId, question, answers, correctAnswerIndex, imagePath, questiontype } = req.body;

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Create a new question object
    const newQuestion = {
      questionText: question,
      options: answers || [],
      correctAnswers: [answers[correctAnswerIndex]],
      questionType: questiontype || null,
      imagePath: imagePath || null
    };

    // Add the new question to the questions array of the quiz
    quiz.questions.push(newQuestion);

    // Save the updated quiz to the database
    await quiz.save();

    res.status(201).json({ message: 'Question added successfully', quiz });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
