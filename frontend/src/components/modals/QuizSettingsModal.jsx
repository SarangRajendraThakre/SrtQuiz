import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { baseUrl1 } from "../../utils/services";
import { useNavigate } from "react-router-dom";


const QuizSettingsModal = ({
  isSettingModalOpen,
  setIsSettingModalOpen,
  formData,
  setFormData,
  tags,
  setTags,
  setCreatedquizDatatitle,
  setQuestionCards,
}) => {
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // State for showing the delete image button (assuming you want to control this within the modal)
  const [showDeleteButton, setShowDeleteButton] = useState(false);

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
  }, [isSettingModalOpen, setIsSettingModalOpen]);

  const handleTagAdd = (event) => {
    if (event.key === "Enter" && event.target.value) {
      setTags([...tags, event.target.value]);
      event.target.value = "";
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue =
      type === "checkbox" ? checked : type === "file" ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      isNewCategory: value === "new", // This logic was in your original, consider if 'new' is always empty string or handled differently
    });
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
        tags: tags,
      };

      let uploadedImagePath = formData.posterImg; // Keep existing if no new file selected

      if (formData.posterImg instanceof File) {
        // Only upload if it's a new file object
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

      // Update formData with the uploaded image path for display
      setFormData({
        ...formData,
        posterImg: uploadedImagePath,
      });

      // No need to reset tags here as they are part of formDataWithUser for this submission
    } catch (error) {
      console.error("Error creating/updating quiz:", error);
    }
  };

  const handleDeleteQuiz = async () => {
    try {
      const createdQuizId = localStorage.getItem("createdQuizId");
      if (!createdQuizId) {
        console.error("No quiz found to delete");
        return;
      }

      await axios.delete(`${baseUrl1}/api/quizzes/delete/${createdQuizId}`);

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

      localStorage.removeItem("createdQuizId");

      setIsSettingModalOpen(false);

      console.log("Quiz deleted successfully");

      navigate("/"); // Assuming '/home' is the path to the homepage
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleImageClick = () => {
    // This function can be used to show a delete button or other options
    setShowDeleteButton(true);
  };

  const handleDeleteImage = async () => {
    try {
      const createdQuizId = localStorage.getItem("createdQuizId");
      if (!createdQuizId) return; // No quiz to update

      await axios.put(`${baseUrl1}/api/quizzes/update/${createdQuizId}`, {
        ...formData,
        posterImg: "", // Empty the poster image path in the database
      });

      setFormData({ ...formData, posterImg: "" }); // Reset the image path in the component state
      setShowDeleteButton(false); // Hide the delete button after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  if (!isSettingModalOpen) return null;

  return (
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
              <option value="">Select Category</option>
              <option value="Geography">Geography</option>
              <option value="History">History</option>
              <option value="Guess">Guess</option>
              <option value="Maths">Maths</option>
              <option value="Movies">Movies</option>
              <option value="Motivational">Motivational</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
              <option value="Computer">Computer</option>
              <option value="Gk">Gk</option>
              {/* Add more categories as needed */}
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
                  src={
                    formData.posterImg instanceof File
                      ? URL.createObjectURL(formData.posterImg)
                      : formData.posterImg
                  }
                  alt="Poster"
                  className="uploaded-image"
                  onClick={handleImageClick}
                />
                {showDeleteButton && (
                  <Button
                    onClick={handleDeleteImage}
                    variant="outlined"
                    color="error"
                    size="small"
                    style={{ marginTop: "5px" }}
                  >
                    Delete Image
                  </Button>
                )}
              </div>
            ) : (
              <button type="button" onClick={handleUploadClick}>
                Upload Image
              </button>
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
  );
};

export default QuizSettingsModal;