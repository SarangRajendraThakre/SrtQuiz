import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.css";
import { useQuiz } from "../../context/QuizContext";
import QuestionCard from "./QuestionCard";


const Sidebar = ({ isModalOpen, handleToggleModal, addQuestion, questionCards, setQuestionCards }) => {
  const { quizData, addEmptyQuestion, questionType, updateQuestionType, updateQuestionIdd, questionIdd } = useQuiz();
  const containerRef = useRef(null);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(null); // Manage selected question index
  const [newlyAddedQuestionId, setNewlyAddedQuestionId] = useState(null); // Keep track of the newly added question ID

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [quizData]);

  const handleDelete = (index) => {
    const updatedQuestionCards = questionCards.filter((_, i) => i !== index);
    setQuestionCards(updatedQuestionCards);
  };

  const handleQuestionCardClick = (questionType, index, questionId) => {
    updateQuestionIdd(questionId);
    updateQuestionType(questionType);
    setSelectedQuestionIndex(index); // Update selected question index
    console.log("Clicked on question card:", questionType, index);
  };

  useEffect(() => {
    // Set the newly added question ID
    if (questionIdd) {
      setNewlyAddedQuestionId(questionIdd);
    }
  }, [questionIdd]);

  return (
    <>
      <div className="sidebar" ref={containerRef}>
        {quizData &&
          quizData.questions &&
          quizData.questions.map((question, index) => {
            const isNew = question._id === newlyAddedQuestionId; // Check if the question ID matches the newly added question ID
            return (
              <QuestionCard
                key={index}
                question={question}
                index={index}
                isSelected={selectedQuestionIndex === index} // Pass isSelected prop based on selection state
                onClick={(questionType, index, questionId) =>
                  handleQuestionCardClick(questionType, index, questionId)
                }
                isNew={isNew} // Pass isNew prop
              />
            );
          })}
      </div>
      <div id="buttonContainer">
        <div className="outerbutton">
          <span>
            <button onClick={handleToggleModal} className="add-question-btn">
              <span>Add question </span>
            </button>
          </span>
          <div className="slide">
            <span>
              <button onClick={handleToggleModal} className="slideinside">
                <span>Add slide </span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
