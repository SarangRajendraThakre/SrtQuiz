import React, { useState, useRef, useEffect } from "react";
import "./createquiz.css";
import Sidebar from "../components/leftsidebar/Sidebar";
import { useQuiz } from "../context/QuizContext";
import Middle from "../components/MiddleQtype/MiddleQtype";
import Headermain from "../components/Header/Headermain";

// Import the new components
import QuizSettingsModal from "../components/modals/QuizSettingsModal";
import AddQuestionModal from "../components/modals/AddQuestionModal";
import PdfToQuestionModal from "../components/modals/PdfToQuestionModal.jsx"; // Import the new PDF modal

const Createquiz = () => {
  const [formData, setFormData] = useState({
    title: "",
    visibility: "public",
    folder: "Your Quiz Folder",
    posterImg: "",
    category: "",
  });

  const [tags, setTags] = useState([]);
  // Corrected state variable names for clarity and consistency
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false); // For AddQuestionModal
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false); // For QuizSettingsModal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false); // For PdfToQuestionModal


  const [questionCards, setQuestionCards] = useState([]); // This state manages what question types are displayed

  // This `setQuestionType` will still cause a TypeError until QuizContext.js is fixed
  const { questionType, setQuestionType } = useQuiz();
  const [createdquizdatatitle, setCreatedquizDatatitle] = useState("");

  // Fix for 'setShowDeleteButton is not defined' (assuming it was used here or in a child)
  // If you had a button or element that called setShowDeleteButton directly in Createquiz.jsx
  // you need to define this state here:
  const [showDeleteButton, setShowDeleteButton] = useState(false); // Example: Add this if needed

  const handleToggleAddQuestionModal = () => {
    setIsAddQuestionModalOpen(!isAddQuestionModalOpen);
  };

  const handleToggleSettingModal = () => {
    setIsSettingModalOpen(!isSettingModalOpen);
  };

    useEffect(() => {
    console.log("isPdfModalOpen changed to:", isPdfModalOpen);
  }, [isPdfModalOpen]);

  // --- Add Image Upload Logic Here ---
  // You mentioned a 404 for image upload previously. This is where your handleSubmit
  // function from previous versions would go. Ensure the URL is corrected to /api/image-upload.
  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = formData.posterImg;

      // Only upload if there's a new image file
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        const uploadResponse = await axios.post(
          `${baseUrl1}/api/image-upload`, // Corrected URL
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        imageUrl = uploadResponse.data.imagePath;
      }

      const quizDataToSubmit = {
        ...formData,
        posterImg: imageUrl,
        tags: tags,
      };

      // Assuming this is for creating a new quiz
      const response = await axios.post(
        `${baseUrl1}/api/quizzes`, // Should be working with express.json() now
        quizDataToSubmit
      );
      console.log("Quiz created/updated:", response.data);
      // Handle success, e.g., navigate or show message
      // Example: navigate('/some-dashboard');

    } catch (error) {
      console.error("Error creating/updating quiz:", error);
      setError(error.response?.data?.error || "Failed to save quiz.");
    } finally {
      setLoading(false);
    }
  };
  */


  return (
    <div className="main">
      <div className="wrapper">
        <div className="spacer">
          <Headermain
            handleToggleModalSetting={handleToggleSettingModal}
            createdquizdatatitle={createdquizdatatitle}
          />
        </div>
        <div className="overflowsidebar">
          <Sidebar
            isModalOpen={isAddQuestionModalOpen} // Use correct state variable
            handleToggleModal={handleToggleAddQuestionModal} // Use correct handler
            questionCards={questionCards}
            setQuestionCards={setQuestionCards}
          />
        </div>
        <div className="maincountainer">
          <Middle questionType={questionType} />
        </div>
      </div>

      <QuizSettingsModal
        isSettingModalOpen={isSettingModalOpen}
        setIsSettingModalOpen={setIsSettingModalOpen}
        formData={formData}
        setFormData={setFormData}
        tags={tags}
        setTags={setTags}
        setCreatedquizDatatitle={setCreatedquizDatatitle}
        setQuestionCards={setQuestionCards} // Pass this down for quiz deletion reset
      />

      <AddQuestionModal
        isModalOpen={isAddQuestionModalOpen} // Use correct state variable
        setIsModalOpen={setIsAddQuestionModalOpen} // Use correct state setter
        setQuestionCards={setQuestionCards}
        setIsPdfModalOpen={setIsPdfModalOpen} // Pass the PDF modal setter
      />

      <PdfToQuestionModal
        isModalOpen={isPdfModalOpen}
        setIsModalOpen={setIsPdfModalOpen}
      />
    </div>
  );
};

export default Createquiz;