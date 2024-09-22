const Quiz = require("../Models/quiz");

// Get quizzes by user ID
exports.getQuizzesByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (userId === "all") {
      const quizzes = await Quiz.find();
      return res.status(200).json({ quizzes });
    }
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
    const { title, visibility, folder, posterImg, createdBy, tags, category } = req.body;
    const quiz = new Quiz({
      title,
      visibility,
      folder,
      posterImg,
      createdBy,
      tags,
      category
    });

    const newQuiz = await quiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addQuestionToQuiz = async (req, res) => {
  try {
    console.log('Request Body from quiz:', req.body); // Log the entire request body

    const { quizId, question, answers, correctAnswerIndex, imagePath, questiontype, explanation } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    console.log('Quiz Found:', quiz); // Log the found quiz

    const newQuestion = {
      questionText: question,
      options: answers || [],
      correctAnswers: correctAnswerIndex || [],
      questionType: questiontype || null,
      imagePath: imagePath || null,
      explanationtext: explanation       };
    console.log('New Question:', newQuestion.explanationtext); // Log new question data

    quiz.questions.push(newQuestion);
    console.log('Quiz Before Save:', quiz); // Log quiz before saving

    const savedQuiz = await quiz.save(); // Save the updated quiz
    console.log('Saved Quiz:', savedQuiz); // Log the saved quiz

    res.status(201).json({ message: 'Question added successfully', quiz: savedQuiz });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Delete question by question ID
exports.deleteQuestionById = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    const quiz = await Quiz.findOne({ "questions._id": questionId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz containing the question not found' });
    }

    quiz.questions = quiz.questions.filter(question => question._id.toString() !== questionId);
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

    const quiz = await Quiz.findOne({ "questions._id": questionId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz containing the question not found' });
    }

    const question = quiz.questions.id(questionId);
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
    console.log('Request Body:', req.body); // Log the entire request body

    const questionId = req.params.questionId;
    const { question, answers, correctAnswerIndices, questiontype ,imagePath, explanation } = req.body;

    const quiz = await Quiz.findOne({ "questions._id": questionId });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz containing the question not found' });
    }

    console.log('Quiz:', quiz); // Log the fetched quiz

    const updatedQuestionIndex = quiz.questions.findIndex(question => question._id.toString() === questionId);
    if (updatedQuestionIndex === -1) {
      return res.status(404).json({ message: 'Question not found within the quiz' });
    }

    const updatedQuestion = {
      questionText: question,
      options: answers || [],
      correctAnswers: correctAnswerIndices || [],
      questionType: questiontype || null,
      imagePath: imagePath || null,
      explanationText: explanation   // Ensure this is included
    };

    console.log('Updated Question:', updatedQuestion); // Log updated question data

    quiz.questions[updatedQuestionIndex] = updatedQuestion;
    console.log('Quiz Before Save:', quiz); // Log quiz before saving

    const savedQuiz = await quiz.save(); // Save the updated quiz
    console.log('Saved Quiz:', savedQuiz); // Log the saved quiz

    res.status(200).json({ message: 'Question updated successfully', quiz: savedQuiz });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

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
    const { title, visibility, folder, posterImg, tags, category } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (!title && !visibility && !folder && !posterImg && !tags && !category) {
      return res.status(400).json({ message: 'At least one field must be provided for updating' });
    }

    if (title) quiz.title = title;
    if (visibility) quiz.visibility = visibility;
    if (folder) quiz.folder = folder;
    if (posterImg) quiz.posterImg = posterImg;
    if (tags) quiz.tags = tags;
    if (category) quiz.category = category;

    const updatedQuiz = await quiz.save();

    res.status(200).json({ message: 'Quiz updated successfully', quiz: updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.deleteQuizById = async (req, res) => {
  try {
    const quizId = req.params.quizId;

    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ message: 'Quiz deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a new question to a quiz
exports.addQuestionssToQuiz = async (req, res) => {
  try {
    const { quizId, question } = req.body;
    console.log('Received request to add question:', req.body); // Log incoming request

    if (!question.explanationText) {
      return res.status(400).json({ message: 'Explanation text is required' });
    }
    
    // Validate required fields
    if (!quizId || !question || !question.questionText || !Array.isArray(question.options) || !Array.isArray(question.correctAnswers)) {
      return res.status(400).json({ message: 'Missing required fields or invalid question format' });
    }

    // Find the quiz by ID
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Create the new question object
    const newQuestion = {
      questionText: question.questionText,
      options: question.options,
      correctAnswers: question.correctAnswers,
      questionType: question.questionType || null,
      imagePath: question.imagePath || null,
      explanationText: explanation
    };

    // Add the new question to the quiz
    quiz.questions.push(newQuestion);
    await quiz.save();

    res.status(201).json({ message: 'Question added successfully', quiz });
  } catch (error) {
    console.error('Error adding question:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

exports.searchQuizzes = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Search quizzes where title, tags, or category matches the query
    const quizzes = await Quiz.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ]
    });

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Modify the backend route to search for quizzes based on any word that matches the title, category, or creator
exports.searchQuizzes = async (req, res) => {
  try {
    const keyword = req.params.keyword;
    const regex = new RegExp(keyword, 'i'); // Case-insensitive regex

    const quizzes = await Quiz.find({
      $or: [
        { title: { $regex: regex } },
        { category: { $regex: regex } },
        { 'creatorName': { $regex: regex } }
      ]
    });

    res.status(200).json({ quizzes });
  } catch (error) {
    console.error('Error searching quizzes:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
