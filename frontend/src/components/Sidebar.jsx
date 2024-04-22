import React, { useEffect, useRef, useState } from "react";
import "./Sidebar.css";
import { useQuiz } from "../context/QuizContext";
import QuestionCard from "./QuestionCard";
import Questionf from "../components/Questionf"; 

const Sidebar = ({ isModalOpen, handleToggleModal, addQuestion, questionCards, setQuestionCards }) => {
  const { quizData, addEmptyQuestion ,questionType, updateQuestionType,updateQuestionIdd,questionIdd} = useQuiz();
  const containerRef = useRef(null);


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
    console.log("Clicked on question card:", questionType, index);
  };
  console.log(questionIdd);

  
  return (
    <>
      <div className="sidebar" ref={containerRef}>
        {quizData &&
          quizData.questions &&
          quizData.questions.map((question, index) => (
            <QuestionCard
              key={index}
              question={question}
              index={index}
              onClick={handleQuestionCardClick}
            />
          ))}
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
