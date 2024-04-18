import "./msq.css";
import React, { useState, useRef } from "react";
import axios from "axios";
import OptionCard from "./OptionCard.jsx";
import SubmitButton from "./SubmitButton.jsx";
import ImageUpload from "./ImageUpload.jsx";
import QuestionTextInput from "./QuestionTextInput.jsx";

const Msq = () => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [questiontype, setQuestionType] = useState("MSQ");
  const [formData, setFormData] = useState({
    // Define formData properties here
    // Example:
    // title: '',
    // visibility: 'public',
    // folder: 'Your Quiz Folder',
    // posterImg: null
  });

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

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const uploadResponse = await axios.post(
        "http://localhost:5000/api/upload",
        formData
      );
      setImagePath(uploadResponse.data.imagePath);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error here (e.g., display error message to user)
    }
  };

  const handleSubmit = async () => {
    try {
      let uploadedImagePath = ""; // Initialize uploadedImagePath to an empty string
  
      // Check if an image is already uploaded and imagePath is not empty
      if (imagePath) {
        // If imagePath is not empty, use the existing image path
        uploadedImagePath = imagePath;
      }
  
      // Get the createdQuizId from local storage
      const createdQuizId = localStorage.getItem('createdQuizId');
  
      // Check if createdQuizId exists
      if (!createdQuizId) {
        console.error('Created Quiz ID not found in local storage');
        return; // Exit the function if createdQuizId is not found
      }
  
      // Send the question data along with the image path and other required fields to the backend
      const questionData = {
        question: question,
        answers: answers,
        correctAnswerIndex: correctAnswerIndex,
        questiontype: questiontype, // Include questiontype field
        imagePath: uploadedImagePath,
        quizId: createdQuizId // Include createdQuizId as quizId in the request data
      };
  
      // Make the API call to add the question
      const addQuestionResponse = await axios.post("http://localhost:5000/api/add-question", questionData);
      
      // Log the response from the backend
      console.log("Question added successfully:", addQuestionResponse.data);
  
      // Clear form fields after successful submission
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswerIndex(null);
      setImagePath("");
    } catch (error) {
      console.error("Error adding question:", error);
      // Handle error
    }
  };

  return (
 
      <div className="questiontext">
          <div className="advertise">
          <div className="advertiseinner"></div>
        </div>

        {/* Render the question text input */}
        <QuestionTextInput value={question} onChange={handleQuestionChange} />
        {/* Render the image upload section */}

        <div className="mainmiddlearea">
          <div className="mainmiddleareainner">
            <div className="mainmiddleareainnerinner">
              <div className="mainmiddleareainnerinnerinner">
                <div className="mainmiddleareainnerinnerinnerinner">
                  <ImageUpload
                    imagePath={imagePath}
                    onImageChange={handleImageChange}
                    onUploadClick={handleUploadClick}
                  />
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>


        <div className="optionmainarea">
          <div className="optionmainareainner">
            {" "}
            <div className="optionmainareainnerinner">
        <div className="optionmainareainnerinnerinner">
          {/* Render the options */}
          {answers.map((answer, index) => (
            <OptionCard
              key={index}
              index={index}
              value={answer}
              onInput={(e) => handleAnswerChange(e, index)}
              onSelectCorrectAnswer={handleSelectCorrectAnswer}
              correctAnswerIndex={correctAnswerIndex}
            />
          ))}
        </div></div></div></div>

        {/* Render the submit button */}
        <SubmitButton onClick={handleSubmit} />
      </div>
     
   
  );
};

export default Msq;
