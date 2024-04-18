import React, { createContext, useState, useContext } from "react";

// Create a context to hold the state
const QuizContext = createContext();

// Create a provider component to manage the state
export const QuizContextProvider = ({ children }) => {
  const [questionData, setQuestionData] = useState({
    question: "",
    answers: ["", "", "", ""],
    correctAnswerIndex: null,
    imagePath: ""
  });

  const handleAddQuestion = async () => {
    try {
      // Make a POST request to send the collected data to the backend
      const response = await axios.post("/api/add-question", questionData);
      console.log("Question added successfully:", response.data);
    } catch (error) {
      console.error("Error adding question:", error);
      // Handle error
    }
  };

  // Provide the state and function to update the state to the context
  return (
    <QuizContext.Provider value={{ questionData, setQuestionData, handleAddQuestion }}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook to consume the context in functional components
export const useQuiz = () => useContext(QuizContext);
