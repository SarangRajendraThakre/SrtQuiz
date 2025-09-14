import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

import { baseUrl1 } from "../../utils/services";

import { useQuiz } from "../../context/QuizContext"; // To access addQuestion function

const PdfToQuestionModal = ({ isModalOpen, setIsModalOpen }) => {
  const modalRef = useRef(null);
  const { addQuestion } = useQuiz(); // Get addQuestion from context

  const [selectedFile, setSelectedFile] = useState(null);
  const [topic, setTopic] = useState(""); // State for the topic input
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState(new Set()); // Using Set for efficient selection tracking
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null); // For errors from the API call

  // External API URL for PDF to questions
 const PDF_GENERATION_API_URL = `${baseUrl1}/api/pdf/upload-pdf`;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
        // Reset state when closing
        setSelectedFile(null);
        setTopic("");
        setGeneratedQuestions([]);
        setSelectedQuestions(new Set());
        setError(null);
        setApiError(null);
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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setError(null);
  };

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
    setError(null);
  };

  const handleGenerateQuestions = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError(null);
    setApiError(null);
    setGeneratedQuestions([]); // Clear previous results
    setSelectedQuestions(new Set()); // Clear previous selections

    const formData = new FormData();
    formData.append("pdfFile", selectedFile);
    formData.append("topic", topic); // Append the topic

    try {
      const response = await axios.post(
        PDF_GENERATION_API_URL, // Use the specific external API
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        setGeneratedQuestions(response.data);
      } else {
        setApiError("Unexpected API response format.");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error generating questions from PDF:", err);
      setApiError(
        err.response?.data?.error ||
          "Failed to generate questions. Please ensure the API is running and accessible."
      );
      setLoading(false);
    }
  };

  const toggleQuestionSelection = (index) => {
    const newSelectedQuestions = new Set(selectedQuestions);
    if (newSelectedQuestions.has(index)) {
      newSelectedQuestions.delete(index);
    } else {
      newSelectedQuestions.add(index);
    }
    setSelectedQuestions(newSelectedQuestions);
  };

  const handleSaveSelectedQuestions = async () => {
    if (selectedQuestions.size === 0) {
      setError("Please select at least one question to save.");
      return;
    }

    // Get the current quiz ID from local storage
    const createdQuizId = localStorage.getItem("createdQuizId");
    if (!createdQuizId) {
      setError("No active quiz found. Please create or select a quiz first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Iterate over selected questions and add them to the quiz
      for (const index of selectedQuestions) {
        const q = generatedQuestions[index];
        // Map the generated question format to your quiz question format
        await addQuestion({ // `addQuestion` from QuizContext is used here
          question: q.question,
          answers: q.options,
          // Convert 'A', 'B', 'C', 'D' to 0, 1, 2, 3
          correctAnswerIndex: q.correct_answer ? q.correct_answer.charCodeAt(0) - 'A'.charCodeAt(0) : null,
          questiontype: q.options && q.options.length > 2 ? "MCQ" : "True/False", // Infer type
          imagePath: "", // No image from PDF generation, typically
          quizId: createdQuizId,
          explanationText: "", // No explanation from PDF generation, typically
        });
      }
      setIsModalOpen(false); // Close modal after saving
      alert("Selected questions added to the quiz successfully!");
    } catch (err) {
      console.error("Error saving selected questions:", err);
      setError("Failed to save selected questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  if (!isModalOpen) return null;

  return (
    <div className="modalsetting1" ref={modalRef}>
      <div className="modalinside">
        <div className="modalagaininside">
          <div className="modalmainheader">
            <div className="modalheader">
              <div className="modalheadertext">PDF to Question Generator</div>
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                &times;
              </button>
            </div>
          </div>
          <div className="mma">
            <div className="modalmainarea">
              <div className="modalmainareainside">
                <div className="pdf-generator-content">
                  <div className="input-section">
                    <input type="file" accept=".pdf" onChange={handleFileChange} />
                    <input
                      type="text"
                      placeholder="Enter topic for questions"
                      value={topic}
                      onChange={handleTopicChange}
                    />
                    <button
                      onClick={handleGenerateQuestions}
                      disabled={!selectedFile || !topic.trim() || loading}
                    >
                      {loading ? "Generating..." : "Generate Questions"}
                    </button>
                  </div>

                  {error && <p className="error-message">{error}</p>}
                  {apiError && <p className="error-message">API Error: {apiError}</p>}

                  {generatedQuestions.length > 0 && (
                    <div className="generated-questions-list">
                      <h3>Select Questions to Add:</h3>
                      {generatedQuestions.map((q, index) => (
                        <div
                          key={index}
                          className={`question-card ${selectedQuestions.has(index) ? "selected" : ""}`}
                          onClick={() => toggleQuestionSelection(index)}
                        >
                          <p><strong>Q{index + 1}:</strong> {q.question}</p>
                          {q.options && q.options.length > 0 && (
                            <ul>
                              {q.options.map((option, optIndex) => (
                                <li key={optIndex}>
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                </li>
                              ))}
                            </ul>
                          )}
                          <p>Correct Answer: {q.correct_answer}</p>
                        </div>
                      ))}
                      <button
                        className="save-selected-button"
                        onClick={handleSaveSelectedQuestions}
                        disabled={selectedQuestions.size === 0 || loading}
                      >
                        Save Selected Questions ({selectedQuestions.size})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfToQuestionModal;