const Quiz = require("../Models/quiz");

// Get quizzes by user ID
exports.getQuizzesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    // Check if userId is "all", if so, fetch all quizzes without filtering
    if (userId === "all") {
      const quizzes = await Quiz.find();
      return res.status(200).json({ quizzes });
    }
    // Otherwise, proceed with filtering by userId
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
      correctAnswers: correctAnswerIndex || [],
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



exports.deleteQuestionById = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    // Find the quiz containing the question
    const quiz = await Quiz.findOne({ "questions._id": questionId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz containing the question not found' });
    }

    // Remove the question from the questions array
    quiz.questions = quiz.questions.filter(question => question._id.toString() !== questionId);

    // Save the updated quiz to the database
    await quiz.save();

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Get question by question ID
exports.getQuestionById = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    // Fetch the question from the database using the questionId
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.status(200).json({ question });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Update question by question ID
exports.updateQuestionById = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const { question, answers, correctAnswerIndices, imagePath, questiontype } = req.body;

    // Find the quiz containing the question
    const quiz = await Quiz.findOne({ "questions._id": questionId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz containing the question not found' });
    }

    // Find and update the question within the quiz
    const updatedQuestionIndex = quiz.questions.findIndex(question => question._id.toString() === questionId);
    if (updatedQuestionIndex === -1) {
      return res.status(404).json({ message: 'Question not found within the quiz' });
    }

    const updatedQuestion = {
      questionText: question,
      options: answers || [],
      correctAnswers: correctAnswerIndices || [],
      questionType: questiontype || null,
      imagePath: imagePath || null
    };

    // Update the question
    quiz.questions[updatedQuestionIndex] = updatedQuestion;

    // Save the updated quiz to the database
    await quiz.save();

    res.status(200).json({ message: 'Question updated successfully', quiz });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all quizzes without visibility
// Get all quizzes without visibility
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ visibility: { $exists: false } });
    res.status(200).json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes without visibility:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// Update an existing quiz
exports.updateQuizById = async (req, res) => {
  try {
    const quizId = req.params.quizId;
    const { title, visibility, folder, posterImg } = req.body;

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Validate input data
    if (!title && !visibility && !folder && !posterImg) {
      return res.status(400).json({ message: 'At least one field must be provided for updating' });
    }

    // Update the quiz properties
    if (title) quiz.title = title;
    if (visibility) quiz.visibility = visibility;
    if (folder) quiz.folder = folder;
    if (posterImg) quiz.posterImg = posterImg;

    // Save the updated quiz to the database
    const updatedQuiz = await quiz.save();

    res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
