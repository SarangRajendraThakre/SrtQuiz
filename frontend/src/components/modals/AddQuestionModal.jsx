import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { baseUrl1 } from "../../utils/services";
import { useQuiz } from "../../context/QuizContext";
import {
  FaCheckCircle,
  FaListUl,
  FaRegDotCircle,
  FaFilePdf,
  FaTimes,
} from "react-icons/fa";
import { RiCheckboxMultipleLine } from "react-icons/ri";

const AddQuestionModal = ({
  isModalOpen,
  setIsModalOpen,
  setQuestionCards,
  setIsPdfModalOpen,
}) => {
  const modalRef = useRef(null);
  const { addQuestion, updateQuestionType } = useQuiz();

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
      updateQuestionType(type);
      setIsModalOpen(false);
      setQuestionCards((prevCards) => [...prevCards, type]);

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
        answers: ["", "", "", ""],
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

  const handleOpenPdfModal = () => {
    setIsModalOpen(false);
    setIsPdfModalOpen(true);
  };

  if (!isModalOpen) return null;

  const questionTypes = [
    { name: "True/False", icon: <FaCheckCircle className="text-green-500" /> },
    { name: "NAT", icon: <FaListUl className="text-purple-500" /> },
    { name: "MSQ", icon: <RiCheckboxMultipleLine className="text-blue-500" /> },
    { name: "MCQ", icon: <FaRegDotCircle className="text-orange-500" /> },
  ];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300 animate-fadeIn"
      >
        {/* Close Button */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center border-b pb-3">
          Select Question Type
        </h2>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          {questionTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => handleAddQuestionType(type.name)}
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl shadow-sm hover:shadow-md hover:bg-blue-50 active:scale-95 transition-all duration-200"
            >
              <div className="text-3xl mb-2">{type.icon}</div>
              <span className="text-sm font-medium text-gray-700">
                {type.name}
              </span>
            </button>
          ))}

          {/* PDF Button */}
          <button
            onClick={handleOpenPdfModal}
            className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-xl shadow-sm hover:shadow-md hover:bg-red-50 active:scale-95 transition-all duration-200"
          >
            <FaFilePdf className="text-3xl text-red-500 mb-2" />
            <span className="text-sm font-medium text-gray-700 text-center">
              PDF to Questions
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
