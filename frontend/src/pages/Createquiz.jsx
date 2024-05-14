import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./createquiz.css";
import Header from "../components/Header/Header";
import Sidebar from "../components/leftsidebar/Sidebar";

import { useQuiz } from "../context/QuizContext"; // Import the useQuiz hook
import Middle from "../components/MiddleQtype/MiddleQtype";

const Createquiz = () => {
  const [formData, setFormData] = useState({
    title: "",
    visibility: "public",
    folder: "Your Quiz Folder",
    posterImg: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const [questionCards, setQuestionCards] = useState([]);
  const modalRef = useRef(null);

  const { addEmptyQuestion, questionType, updateQuestionType } = useQuiz(); // Destructure the addEmptyQuestion function from useQuiz

  const [createdquizdatatitle, setCreatedquizDatatitle] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAddQuestion = (type) => {
    setQuestionType(type);
    setIsModalOpen(false);
    setQuestionCards([...questionCards, type]);
  };

  const handleToggleModalSetting = () => {
    setIsSettingModalOpen(!isSettingModalOpen);
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("User"));

      if (!user || !user._id) {
        console.error(
          "User ID not found in local storage or user object is invalid"
        );
        return;
      }

      const formDataWithUser = {
        ...formData,
        createdBy: user._id,
      };

      let uploadedImagePath = "";

      if (formData.posterImg) {
        const formDataWithImage = new FormData();
        formDataWithImage.append("image", formData.posterImg);

        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          formDataWithImage
        );

        uploadedImagePath = uploadResponse.data.imagePath;
      }

      if (uploadedImagePath) {
        formDataWithUser.posterImg = uploadedImagePath;
      }

      const response = await axios.post(
        "http://localhost:5000/api/quizzes",
        formDataWithUser
      );
      const createdQuizId = response.data._id;
      console.log(response.data);
      localStorage.setItem("createdQuizId", createdQuizId);

      setCreatedquizDatatitle(response.data.title);
      console.log(createdquizdatatitle);

      setIsSettingModalOpen(false);

      setFormData({
        title: "",
        visibility: "public",
        folder: "Your Quiz Folder",
        posterImg: uploadedImagePath,
      });
    } catch (error) {
      console.error("Error creating quiz:", error);
    }
    setIsSettingModalOpen(false);
  };

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
  }, [isModalOpen]);

  useEffect(() => {
    const handleSettingOutsideClick = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsSettingModalOpen(false);
      }
    };

    if (isSettingModalOpen) {
      document.addEventListener("mousedown", handleSettingOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleSettingOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleSettingOutsideClick);
    };
  }, [isSettingModalOpen]);

  const { addQuestion } = useQuiz(); // Destructure addQuestion function from the context

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState([
    "",
    "",
    "",
    "",
  ]);
  const [imagePath, setImagePath] = useState("");
  const [questiontypee, setQuestionTypee] = useState("");
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.innerText;
    setAnswers(newAnswers);
  };

  const handleSelectCorrectAnswer = (index) => {
    setCorrectAnswerIndex(index);
  };

  const handleSubmite = async (type) => {
    try {
      let uploadedImagePath = "";

      let createdQuizId = localStorage.getItem("createdQuizId");

      if (!createdQuizId) {
        // If quiz ID is not found, create an empty quiz
        const response = await axios.post("http://localhost:5000/api/quizzes", {
          title: "",
          visibility: "public",
          folder: "Your Quiz Folder",
          posterImg: "",
        });

        createdQuizId = response.data._id;
        console.log("Empty quiz created:", response.data);

        // Store the created quiz ID in local storage
        localStorage.setItem("createdQuizId", createdQuizId);
      }
      const questionData = {
        question: question,
        answers: answers,
        correctAnswerIndex: correctAnswerIndex,
        questiontype: type,
        imagePath: uploadedImagePath,
        quizId: createdQuizId,
      };

      // Add the question using the addQuestion function from the context
      await addQuestion(questionData);

      // Clear form fields after successful submission
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswerIndex(["", "", "", ""]);
      setImagePath("");

      // Clear form fields and close modal
    } catch (error) {
      console.error("Error creating quiz:", error);
    }

    updateQuestionType(type);
    setIsModalOpen(false);
    setQuestionCards([...questionCards, type]);
  };

  return (
    <div className="main">
      <div className="wrapper">
        <div className="spacer">
          <Header
            handleToggleModalSetting={handleToggleModalSetting}
            createdquizdatatitle={createdquizdatatitle}
          />
        </div>
        <div className="overflowsidebar">
          <Sidebar
            isModalOpen={isModalOpen}
            handleToggleModal={handleToggleModal}
            addQuestion={handleAddQuestion}
            questionCards={questionCards}
            setQuestionCards={setQuestionCards}
          />
        </div>
        <div className="maincountainer">
          <Middle questionType={questionType} />
        </div>
      </div>

      {isSettingModalOpen && (
        <div
          className="modalsetting p-6 rounded-sm modalinside m"
          ref={modalRef}
        >
          <div className="modalinside">
            <form>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </label>
              <label>
                Visibility:
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </label>
              <label>
                Folder:
                <select
                  name="folder"
                  value={formData.folder}
                  onChange={handleChange}
                >
                  <option value="Your Quiz Folder">Your Quiz Folder</option>
                </select>
              </label>
              <label>
                Poster Image:
                <input
                  type="file"
                  name="posterImg"
                  accept="image/*"
                  onChange={handleChange}
                />
              </label>
            </form>
            <button className="p-2" onClick={handleSubmit}>
              Create Quiz
            </button>
          </div>
        </div>
      )}

      {isModalOpen && (
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
                          <div className="testknowtitle">True/False</div>
                          <div className="questionlist">
                            <button
                              className="modalbuttons"
                              onClick={() => handleSubmite("True/False")}
                            >
                              True/False
                            </button>
                            <button
                              className="modalbuttons"
                              onClick={() => handleSubmite("MCQ")}
                            >
                              MCQ
                            </button>
                            <button
                              className="modalbuttons"
                              onClick={() => handleSubmite("MSQ")}
                            >
                              MSQ
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
      )}
    </div>
  );
};

export default Createquiz;
