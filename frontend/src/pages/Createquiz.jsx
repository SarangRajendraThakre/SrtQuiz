import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./createquiz.css";
import Header from "../components/Header/Header1";
import Sidebar from "../components/leftsidebar/Sidebar";
import { useQuiz } from "../context/QuizContext";
import Middle from "../components/MiddleQtype/MiddleQtype";
import { baseUrl1 } from "../utils/services";

import { useNavigate } from "react-router-dom";
import Headermain from "../components/Header/Headermain";

const Createquiz = () => {
  const [formData, setFormData] = useState({
    title: "",
    visibility: "public",
    folder: "Your Quiz Folder",
    posterImg: "",
    category: "",
  });

  const [tags, setTags] = useState([]); // State for managing tags
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const [questionCards, setQuestionCards] = useState([]);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  const { addEmptyQuestion, questionType, updateQuestionType } = useQuiz();
  const [createdquizdatatitle, setCreatedquizDatatitle] = useState("");

  const handleTagAdd = (event) => {
    if (event.key === "Enter" && event.target.value) {
      setTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
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

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    if (value === "new") {
      setFormData({
        ...formData,
        [name]: "",
        isNewCategory: true,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
        isNewCategory: false,
      });
    }
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
        tags: tags, // Include tags in form data
      };

      let uploadedImagePath = "";

      if (formData.posterImg) {
        const formDataWithImage = new FormData();
        formDataWithImage.append("image", formData.posterImg);

        const uploadResponse = await axios.post(
          `${baseUrl1}/api/upload`,
          formDataWithImage
        );
        uploadedImagePath = uploadResponse.data.imagePath;
      }

      if (uploadedImagePath) {
        formDataWithUser.posterImg = uploadedImagePath;
      }

      let response;
      let createdQuizId = localStorage.getItem("createdQuizId");

      if (createdQuizId && createdQuizId !== "null") {
        response = await axios.put(
          `${baseUrl1}/api/quizzes/update/${createdQuizId}`,
          formDataWithUser
        );
      } else {
        response = await axios.post(
          `${baseUrl1}/api/quizzes`,
          formDataWithUser
        );
        createdQuizId = response.data._id;
        localStorage.setItem("createdQuizId", createdQuizId);
      }

      setCreatedquizDatatitle(response.data.title);
      setIsSettingModalOpen(false);

      setFormData({
        title: "",
        visibility: "public",
        folder: "Your Quiz Folder",
        posterImg: uploadedImagePath,
        category: "",
      });
      setTags([]); // Reset tags
    } catch (error) {
      console.error("Error creating/updating quiz:", error);
    }
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

  const { addQuestion } = useQuiz();
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
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
        const response = await axios.post(`${baseUrl1}/api/quizzes`, {
          title: "",
          visibility: "public",
          folder: "Your Quiz Folder",
          posterImg: "",
        });

        createdQuizId = response.data._id;
        console.log("Empty quiz created:", response.data);
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

      await addQuestion(questionData);

      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswerIndex(null);
      setImagePath("");
    } catch (error) {
      console.error("Error creating quiz:", error);
    }

    updateQuestionType(type);
    setIsModalOpen(false);
    setQuestionCards([...questionCards, type]);
  };

  const handleDeleteQuiz = async () => {
    try {
      const createdQuizId = localStorage.getItem("createdQuizId");
      if (!createdQuizId) {
        console.error("No quiz found to delete");
        return;
      }

      // Make a DELETE request to delete the quiz
      const response = await axios.delete(
        `${baseUrl1}/api/quizzes/delete/${createdQuizId}`
      );

      // Reset the form data, tags, and any other necessary state
      setFormData({
        title: "",
        visibility: "public",
        folder: "Your Quiz Folder",
        posterImg: "",
        category: "",
      });
      setTags([]);
      setQuestionCards([]);
      setCreatedquizDatatitle("");

      // Remove the quiz ID from local storage
      localStorage.removeItem("createdQuizId");

      // Close the modal
      setIsSettingModalOpen(false);

      console.log("Quiz deleted successfully:", response.data);

      // Redirect to the homepage
      navigate("/"); // Assuming '/home' is the path to the homepage
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleImageClick = () => {
    // Show delete button when image is clicked
    setShowDeleteButton(true);
  };

  const handleDeleteImage = async () => {
    try {
      // Empty the image path in the database
      const createdQuizId = localStorage.getItem("createdQuizId");
      await axios.put(`${baseUrl1}/api/quizzes/update/${createdQuizId}`, {
        ...formData,
        posterImg: "", // Empty the poster image path
      });
      // Reset the image path in the component state
      setFormData({ ...formData, posterImg: "" });
      // Hide the delete button
      setShowDeleteButton(false);
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="main">
      <div className="wrapper">
        <div className="spacer">
          <Headermain
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
      <footer className="footermain">Developed by : SARANG .R. THAKRE</footer>

      {isSettingModalOpen && (
        <div
          className="modalsetting p-6 rounded-sm modalinside m"
          ref={modalRef}
        >
          <div className="modalsetting-title">Setting of Quiz</div>
          <div className="modalinside">
            <form>
              {/* Title */}
              <label className="form-label">
                Title:
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                />
              </label>

              {/* Visibility */}
              <label className="form-label">
                Visibility:
                <select
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </label>

              {/* Category */}
              <label className="form-label">
                Category:
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="form-select"
                >
                  {/* Options for existing categories */}
                  <option value="">Select Category</option>
                  <option value="Geography">Geography</option>
                  <option value="History">History</option>
                  <option value="Guess">Guess</option>
                  <option value="Maths">Maths</option>
                  <option value="Movies">Movies</option>
                  <option value="Motivational">Motivational</option>
                  <option value="Biology">Biology</option>
                  <option value="Physics">Physics</option>
                  <option value="Gk">Gk</option>
                </select>
              </label>

              {/* Poster Image */}
              <label>
          Poster Image:
          <input
            type="file"
            name="posterImg"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          {formData.posterImg ? (
            <div className="image-container">
              <img
                src={formData.posterImg}
                alt="Poster"
                className="uploaded-image"
                onClick={handleImageClick}
              />
            
            </div>
          ) : (
            <button type="button" onClick={handleUploadClick}>Upload Image</button>
          )}
        </label>

              {/* Tags */}
              <label className="form-label">
                <TextField
                  onKeyPress={handleTagAdd}
                  label="Press enter to add tag"
                  fullWidth
                  className="form-input"
                />
                <div>
                  {tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={() => handleTagDelete(tag)}
                      style={{ margin: "5px" }}
                    />
                  ))}
                </div>
              </label>

              {/* Buttons */}
              <div className="form-buttons">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="create-button"
                >
                  {window.location.pathname.includes("/createquiz/")
                    ? "Update Quiz"
                    : "Create Quiz"}
                </button>
                <button
                  type="button"
                  onClick={handleDeleteQuiz}
                  className="delete-button"
                >
                  Delete Quiz
                </button>
              </div>
            </form>
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
                              onClick={() => handleSubmite("NAT")}
                            >
                              NAT
                            </button>
                            <button
                              className="modalbuttons"
                              onClick={() => handleSubmite("MSQ")}
                            >
                              MSQ
                            </button>
                            <button
                              className="modalbuttons"
                              onClick={() => handleSubmite("MCQ")}
                            >
                              MCQ
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
