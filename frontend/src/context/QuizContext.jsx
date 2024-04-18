import React, { createContext, useState, useContext, useEffect } from "react";
import axios from 'axios';

// Create a context to hold the state
const QuizContext = createContext();

// Create a provider component to manage the state
export const QuizContextProvider = ({ children }) => {
  const [quizData, setQuizData] = useState({ quiz: null, questions: [] }); // Initialize quizData with an empty questions array
  const [questionType, setQuestionType] = useState(null);
  const [questionId, setQuestionId] = useState(null);

  const updateQuestionType = (type) => {
    setQuestionType(type);
  };
  const updateQuestionId = (Id) => {
    setQuestionType(Id);
  };


  // Define fetchQuizData function
  const fetchQuizData = async () => {
    try {
      const quizId = localStorage.getItem('createdQuizId');
      console.log('Quiz ID:', quizId);

      if (!quizId) {
        throw new Error('Quiz ID not found in local storage');
      }

      // Fetch the quiz data from the backend
      const response = await axios.get(`http://localhost:5000/api/quizzes/quiz/${quizId}`);
      console.log('Response:', response);

      // Set the quiz data state with the fetched data
      setQuizData(response.data.quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  useEffect(() => {
    // Fetch quiz data when component mounts
    fetchQuizData();

  }, []);

  const addQuestion = async (newQuestionData) => {
    try {
      // Send the new question data to the backend
      const response = await axios.post("http://localhost:5000/api/add-question", newQuestionData);

      // Log the response from the backend
      console.log("Question added successfully:", response.data);

      // Update the quizData state with the new question
      setQuizData(prevQuizData => ({
        ...prevQuizData,
        questions: [...prevQuizData.questions, response.data.quiz.questions[response.data.quiz.questions.length - 1]]
      }));
      
      console.log(quizData);
    } catch (error) {
      console.error("Error adding question:", error);
      // Handle error
    }
  };

  const deleteQuestionById = async (questionId) => {
    try {
      // Send a request to delete the question from the backend
      await axios.delete(`http://localhost:5000/api/questions/delete/${questionId}`);
      console.log('Question deleted successfully');
      // Refetch the quiz data
      await fetchQuizData();
    } catch (error) {
      console.error('Error deleting question:', error);
      // Handle error
    }
  };

  // Function to add an empty question
 // Function to add an empty question
// Function to add an empty question



  // Provide the state and functions to the context
  return (
    <QuizContext.Provider value={{ quizData, addQuestion,questionType,questionId,updateQuestionId,updateQuestionType, deleteQuestionById, fetchQuizData }}>
      {children}
    </QuizContext.Provider>
  );
};


// Custom hook to consume the context in functional components
export const useQuiz = () => useContext(QuizContext);
