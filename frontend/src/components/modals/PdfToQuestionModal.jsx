import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { baseUrl1 } from "../../utils/services";
import { useQuiz } from "../../context/QuizContext";
import { IoMdClose } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";

const PdfToQuestionModal = ({ isModalOpen, setIsModalOpen }) => {
  const modalRef = useRef(null);
  const { addQuestion } = useQuiz();

  const [selectedFile, setSelectedFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set());
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);

  const PDF_GENERATION_API_URL = `${baseUrl1}/api/pdf/upload-pdf`;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    if (isModalOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isModalOpen]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setTopic("");
    setGeneratedQuestions([]);
    setSelectedQuestions(new Set());
    setError(null);
    setApiError(null);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setError(null);
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
    setError(null);
  };

  const handleGenerateQuestions = async () => {
    if (!selectedFile && !topic.trim()) {
      setError("Please select a PDF or enter a topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setApiError(null);
    setGeneratedQuestions([]);
    setSelectedQuestions(new Set());

    const formData = new FormData();
    if (selectedFile) formData.append("pdfFile", selectedFile);
    if (topic.trim()) formData.append("topic", topic);

    try {
      const res = await axios.post(PDF_GENERATION_API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (Array.isArray(res.data)) {
        setGeneratedQuestions(res.data);
      } else {
        setApiError("Unexpected API response format.");
      }
    } catch (err) {
      console.error("Error:", err);
      setApiError(
        err.response?.data?.error ||
          "Failed to generate questions. Please check your API."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionSelection = (i) => {
    const newSel = new Set(selectedQuestions);
    newSel.has(i) ? newSel.delete(i) : newSel.add(i);
    setSelectedQuestions(newSel);
  };

  const toggleSelectAll = () => {
    if (selectedQuestions.size === generatedQuestions.length) {
      setSelectedQuestions(new Set());
    } else {
      setSelectedQuestions(new Set(generatedQuestions.map((_, i) => i)));
    }
  };

  const handleSaveSelectedQuestions = async () => {
    if (selectedQuestions.size === 0) {
      setError("Please select at least one question to save.");
      return;
    }

    const quizId = localStorage.getItem("createdQuizId");
    if (!quizId) {
      setError("No active quiz found. Please create one first.");
      return;
    }

    setLoading(true);
    try {
      for (const i of selectedQuestions) {
        const q = generatedQuestions[i];
        const correctIndex = q.correct_answer
          ? q.correct_answer.toUpperCase().charCodeAt(0) - 65
          : null;
        const type = q.options?.length > 2 ? "MCQ" : "True/False";
        await addQuestion({
          question: q.question,
          answers: q.options,
          correctAnswerIndex: correctIndex,
          questiontype: type,
          imagePath: "",
          quizId,
          explanationText: "",
        });
      }
      closeModal();
    } catch (err) {
      console.error("Save error:", err);
      setError("Failed to save questions.");
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-[10000] p-2 sm:p-6">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-3xl lg:max-w-5xl flex flex-col max-h-[95vh] overflow-hidden"
        ref={modalRef}
      >
        {/* Header */}
        <div className="p-4 bg-indigo-600 flex justify-between items-center">
          <h3 className="text-lg sm:text-xl font-semibold text-white">
            Generate Questions
          </h3>
          <button
            className="text-white hover:text-gray-200"
            onClick={closeModal}
          >
            <IoMdClose size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-4 sm:p-5 overflow-y-auto">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full text-sm border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Enter topic"
              value={topic}
              onChange={handleTopicChange}
              className="w-full text-sm border border-gray-300 rounded-md p-2 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={handleGenerateQuestions}
            disabled={loading || (!selectedFile && !topic.trim())}
            className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center shadow-md"
          >
            {loading && <FaSpinner className="animate-spin mr-2" />}
            {loading ? "Generating..." : "Generate"}
          </button>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
          {apiError && (
            <p className="text-red-500 text-sm mt-3">API Error: {apiError}</p>
          )}

          {generatedQuestions.length > 0 && (
            <>
              <div className="flex justify-between items-center mt-5 mb-3">
                <h3 className="text-base font-semibold text-gray-800">
                  Select Questions
                </h3>
                <button
                  onClick={toggleSelectAll}
                  className="text-sm text-indigo-600 font-semibold hover:text-indigo-800"
                >
                  {selectedQuestions.size === generatedQuestions.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              {/* Responsive list view */}
              <div className="flex flex-col gap-3 overflow-y-auto max-h-[55vh] pr-1">
                {generatedQuestions.map((q, i) => (
                  <div
                    key={i}
                    onClick={() => toggleQuestionSelection(i)}
                    className={`rounded-xl p-3 border-2 transition cursor-pointer ${
                      selectedQuestions.has(i)
                        ? "border-indigo-600 bg-indigo-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex justify-between mb-1 text-sm font-semibold text-gray-700">
                      <span>Q{i + 1}</span>
                      <span className="text-green-600">
                        Ans: {q.correct_answer || "-"}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm mb-2">{q.question}</p>
                    {q.options?.length > 0 && (
                      <ul className="text-sm space-y-1">
                        {q.options.map((opt, j) => (
                          <li
                            key={j}
                            className={`${
                              String.fromCharCode(65 + j) === q.correct_answer
                                ? "text-yellow-700 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            <strong>{String.fromCharCode(65 + j)}.</strong>{" "}
                            {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 mt-5 bg-white py-3">
                <button
                  onClick={handleSaveSelectedQuestions}
                  disabled={selectedQuestions.size === 0 || loading}
                  className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 shadow-md"
                >
                  {loading
                    ? "Saving..."
                    : `Save Selected (${selectedQuestions.size})`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfToQuestionModal;
