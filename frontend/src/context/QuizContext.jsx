import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { baseUrl1 } from "../utils/services";

const QuizContext = createContext();

export const QuizContextProvider = ({ children }) => {
  const [quizData, setQuizData] = useState({ quiz: null, questions: [] });
  const [questionType, setQuestionType] = useState(null);
  const [questionIdd, setQuestionIdd] = useState(null);
  const [createdQuizId, setCreatedQuizId] = useState(null);
  const [isRightsideVisible, setIsRightsideVisible] = useState(true); // New state for visibility

  const toggleRightsideVisibility = () => {
    setIsRightsideVisible(!isRightsideVisible);
  };
  const updateQuestionType = (type) => {
    setQuestionType(type);
  };
  const updateQuestionIdd = (id) => {
    setQuestionIdd(id);
  };

  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image

  const selectImage = (image) => {
    setSelectedImage(image);
  };

  // Define fetchQuizData function
  const fetchQuizData = async () => {
    try {
      const quizId = localStorage.getItem("createdQuizId");
      console.log("Quiz ID:", quizId);

      if (!quizId) {
        throw new Error("Quiz ID not found in local storage");
      }

      // Fetch the quiz data from the backend
      const response = await axios.get(
        `${baseUrl1}/api/quizzes/quiz/${quizId}`
      );
      console.log("Response:", response);

      // Set the quiz data state with the fetched data
      setQuizData(response.data.quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  useEffect(() => {
    // Fetch quiz data when component mounts
    fetchQuizData();
  }, [createdQuizId]); // Add createdQuizId to the dependency array

  const addQuestion = async (newQuestionData) => {
    try {
      // Send the new question data to the backend
      const response = await axios.post(
        `${baseUrl1}/api/add-question`,
        newQuestionData
      );

      // Log the response from the backend
      console.log("Question added successfully:", response.data);

      if (response.data.questions && response.data.questions.length > 0) {
        const questionId =
          response.data.questions[response.data.questions.length - 1]._id;
        // Proceed with further operations using questionId
        setQuestionIdd(questionId);
      } else {
        console.error("Error: No questions found in the response data.");
        // Handle the case where no questions are found in the response data
      }

      // Update the quizData state with the new question
      setQuizData((prevQuizData) => ({
        ...prevQuizData,
        questions: [
          ...prevQuizData.questions,
          response.data.quiz.questions[response.data.quiz.questions.length - 1],
        ],
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
      await axios.delete(`${baseUrl1}/api/questions/delete/${questionId}`);
      console.log("Question deleted successfully");
      // Refetch the quiz data
      await fetchQuizData();
    } catch (error) {
      console.error("Error deleting question:", error);
      // Handle error
    }
  };

  // Function to get question data by ID
  const getQuestionById = () => {
    if (!quizData || !quizData.questions || !questionIdd) {
      // Return null if quizData, questions array, or questionIdd is not available
      return null;
    }

    // Find the question in the questions array by its ID
    const foundQuestion = quizData.questions.find(
      (question) => question._id === questionIdd
    );

    // Return the found question or null if not found
    return foundQuestion || null;
  };

  const updateQuestionById = async (questionId, updatedQuestionData) => {
    try {
      // Send the updated question data to the backend
      const response = await axios.put(
        `${baseUrl1}/api/questions/update/${questionId}`,
        updatedQuestionData
      );

      // Log the response from the backend
      console.log("Question updated successfully:", response.data);

      // Refetch the quiz data to get the updated question
      await fetchQuizData();
    } catch (error) {
      console.error("Error updating question:", error);
      // Handle error
    }
  };

  return (
    <QuizContext.Provider
      value={{
        quizData,
        addQuestion,
        questionType,
        questionIdd,
        updateQuestionIdd,
        updateQuestionType,
        deleteQuestionById,
        fetchQuizData,
        getQuestionById,
        updateQuestionById,
        isRightsideVisible, // Include the visibility state
        toggleRightsideVisibility, // Include the function to toggle visibility
        selectedImage,
        selectImage,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
