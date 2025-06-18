// In AddQuestionModal.jsx

import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { baseUrl1 } from "../../utils/services"; // Correct relative path
import { useQuiz } from "../../context/QuizContext";


const AddQuestionModal = ({
  isModalOpen,
  setIsModalOpen,
  setQuestionCards,
  setIsPdfModalOpen, // <--- YOU NEED TO PASS THIS PROP FROM Createquiz.jsx
}) => {
  const modalRef = useRef(null);
  // This `updateQuestionType` will still cause a TypeError until QuizContext.js is fixed
  const { addQuestion, updateQuestionType } = useQuiz();

  // State for question details (can be managed here or passed from parent if needed)
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [explanation, setExplanation] = useState("");

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isModalOpen, setIsModalOpen]);

  const handleAddQuestionType = async (type) => {
    try {
      // This `updateQuestionType` function needs to be provided by QuizContext.js
      updateQuestionType(type); // Call updateQuestionType instead of setQuestionType
      setIsModalOpen(false); // Close this modal
      setQuestionCards((prevCards) => [...prevCards, type]); // Add to parent's questionCards

      let createdQuizId = localStorage.getItem("createdQuizId");
      if (!createdQuizId) {
        const response = await axios.post(`${baseUrl1}/api/quizzes`, {
          title: "Untitled Quiz",
          visibility: "public",
          folder: "Your Quiz Folder",
          posterImg: "",
        });
        createdQuizId = response.data._id;
        localStorage.setItem("createdQuizId", createdQuizId);
      }

      await addQuestion({
        question: "",
        answers: [],
        correctAnswerIndex: null,
        questiontype: type,
        imagePath: "",
        quizId: createdQuizId,
        explanationText: "",
      });

      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswerIndex(null);
      setExplanation("");
    } catch (error) {
      console.error("Error adding question type:", error);
    }
  };

  // NEW FUNCTION TO OPEN PDF MODAL
  const handleOpenPdfModal = () => {
    setIsModalOpen(false); // Close the current AddQuestionModal
    setIsPdfModalOpen(true); // Open the PDF to Question modal (This is the key!)
  };

  if (!isModalOpen) return null;

  return (
    <div className="modalsetting1" ref={modalRef}>
      <div className="modalinside">
        <div className="modalagaininside">
          <div className="modalmainheader ">
            <div className="modalheader">
              <div className="modalheadertext">Select Question Type</div>
            </div>
          </div>
          <div className="mma">
            <div className="modalmainarea">
              <div className="modalmainareainside">
                <div className="modalmainareainsideinsdie">
                  <div className="modallsidequestionlist">
                    <div className="modalquestiontyep">
                      <div className="testknowtitle">Question Types</div>
                      <div className="questionlist">
                        <button
                          className="modalbuttons"
                          onClick={() => handleAddQuestionType("True/False")}
                        >
                          True/False
                        </button>
                        <button
                          className="modalbuttons"
                          onClick={() => handleAddQuestionType("NAT")}
                        >
                          NAT
                        </button>
                        <button
                          className="modalbuttons"
                          onClick={() => handleAddQuestionType("MSQ")}
                        >
                          MSQ
                        </button>
                        <button
                          className="modalbuttons"
                          onClick={() => handleAddQuestionType("MCQ")}
                        >
                          MCQ
                        </button>
                        {/* THIS IS THE CHANGE YOU NEED TO MAKE */}
                        <button
                          className="modalbuttons"
                          onClick={handleOpenPdfModal} 
                        >
                          PDF to question generator
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;