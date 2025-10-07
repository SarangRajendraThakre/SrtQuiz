import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseUrl1 } from "../../utils/services";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiTrash2, FiEye, FiTag, FiBook, FiImage, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

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

  const [showDeleteButton, setShowDeleteButton] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsSettingModalOpen(false);
      }
    };

    if (isSettingModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSettingModalOpen, setIsSettingModalOpen]);

  const handleTagAdd = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      setTags([...tags, e.target.value.trim()]);
      e.target.value = "";
    }
  };

  const handleTagDelete = (tag) => setTags(tags.filter((t) => t !== tag));

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    const newValue = type === "checkbox" ? checked : type === "file" ? files[0] : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      isNewCategory: value === "new",
    });
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("User"));
      if (!user || !user._id) return;

      const dataToSend = {
        ...formData,
        createdBy: user._id,
        tags,
      };

      let uploadedImagePath = formData.posterImg;
      if (formData.posterImg instanceof File) {
        const imageForm = new FormData();
        imageForm.append("image", formData.posterImg);
        const res = await axios.post(`${baseUrl1}/api/upload`, imageForm);
        uploadedImagePath = res.data.imagePath;
      }
      dataToSend.posterImg = uploadedImagePath;

      let createdQuizId = localStorage.getItem("createdQuizId");
      const response = createdQuizId
        ? await axios.put(`${baseUrl1}/api/quizzes/update/${createdQuizId}`, dataToSend)
        : await axios.post(`${baseUrl1}/api/quizzes`, dataToSend);

      if (!createdQuizId) {
        createdQuizId = response.data._id;
        localStorage.setItem("createdQuizId", createdQuizId);
      }

      setCreatedquizDatatitle(response.data.title);
      setFormData({ ...formData, posterImg: uploadedImagePath });
      setIsSettingModalOpen(false);
    } catch (err) {
      console.error("Error saving quiz:", err);
    }
  };

  const handleDeleteQuiz = async () => {
    try {
      const createdQuizId = localStorage.getItem("createdQuizId");
      if (!createdQuizId) return;
      await axios.delete(`${baseUrl1}/api/quizzes/delete/${createdQuizId}`);
      setFormData({ title: "", visibility: "public", folder: "", posterImg: "", category: "" });
      setTags([]);
      setQuestionCards([]);
      setCreatedquizDatatitle("");
      localStorage.removeItem("createdQuizId");
      setIsSettingModalOpen(false);
      navigate("/");
    } catch (err) {
      console.error("Error deleting quiz:", err);
    }
  };

  const handleUploadClick = () => fileInputRef.current.click();
  const handleDeleteImage = () => setFormData({ ...formData, posterImg: "" });

  if (!isSettingModalOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black bg-opacity-40 flex justify-center items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FiBook className="text-blue-600" /> Quiz Settings
        </h2>

        {/* Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiCheckCircle className="text-blue-500" /> Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Enter quiz title"
              />
            </div>

            {/* Visibility */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiEye className="text-green-600" /> Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiTag className="text-purple-500" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
              >
                <option value="">Select Category</option>
                {[
                  "Geography",
                  "History",
                  "Guess",
                  "Maths",
                  "Movies",
                  "Motivational",
                  "Biology",
                  "Physics",
                  "Computer",
                  "Gk",
                ].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <FiTag className="text-orange-500" /> Tags
              </label>
              <input
                type="text"
                placeholder="Press Enter to add tag"
                onKeyPress={handleTagAdd}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                  >
                    {tag}
                    <FiTrash2
                      onClick={() => handleTagDelete(tag)}
                      className="cursor-pointer text-red-500 hover:scale-110 transition"
                    />
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side — Poster */}
          <div>
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FiImage className="text-pink-500" /> Poster Image
            </label>

            <input
              ref={fileInputRef}
              type="file"
              name="posterImg"
              accept="image/*"
              onChange={handleChange}
              style={{ display: "none" }}
            />

            {formData.posterImg ? (
              <div className="relative mt-2 group">
                <img
                  src={
                    formData.posterImg instanceof File
                      ? URL.createObjectURL(formData.posterImg)
                      : formData.posterImg
                  }
                  alt="Poster"
                  className="w-full h-48 rounded-lg object-cover border"
                />
                <motion.button
                  onClick={handleDeleteImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                  whileHover={{ scale: 1.1 }}
                >
                  <FiTrash2 />
                </motion.button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-full mt-2 h-48 border border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-50 transition"
              >
                <FiUpload className="text-2xl mr-2" /> Upload Poster
              </button>
            )}
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleDeleteQuiz}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <FiTrash2 /> Delete
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <FiCheckCircle /> {window.location.pathname.includes("/createquiz/") ? "Update Quiz" : "Create Quiz"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuizSettingsModal;
