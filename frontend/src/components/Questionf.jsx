import React, { useState } from "react";
import axios from 'axios'; // Import axios for HTTP requests
import "./Questionf.css";
import Mcq from "./questiontype/Mcq.jsx";
import TrueFalse from "./questiontype/TrueFalse.jsx";
import Rightside from "./Rightside.jsx";
import Msq from "./questiontype/Msq.jsx";

const Questionf = ({ questionType }) => {
  const [option1Text, setOption1Text] = useState("");
  const [option2Text, setOption2Text] = useState("");
  const [option3Text, setOption3Text] = useState("");
  const [option4Text, setOption4Text] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const addQuestion = () => {
    const newQuestion = {
      questionText,
      options,
      correctAnswers,
      questionType,
    };
    setQuestions([...questions, newQuestion]);
    // Clear input fields after adding question
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setCorrectAnswers([]);
  };

  const handleSubmit = async () => {
    try {
      // Upload image
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios.post(
        "http://localhost:3001/api/upload",
        formData
      );
      const imagePath = response.data.imagePath;

      // Send quiz data to backend API including quizTitle and imagePath
      await axios.post("http://localhost:3001/api/quizzes", {
        title: quizTitle,
        visibility: "public",
        imagePath,
        questions,
      });
      alert("Quiz submitted successfully!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  const handleOption1Change = (e) => {
    setOption1Text(e.target.textContent);
  };

  const handleOption2Change = (e) => {
    setOption2Text(e.target.textContent);
  };

  const handleOption3Change = (e) => {
    setOption3Text(e.target.textContent);
  };

  const handleOption4Change = (e) => {
    setOption4Text(e.target.textContent);
  };

  return (
    <div className="srt">
      {questionType === null && <Mcq/>}
      {questionType === "True/False" && <TrueFalse />}
      {questionType === "MCQ" && <Mcq />}
      {questionType === "MSQ" && <Msq/>}
      <Rightside/>
    </div>
  );
};

export default Questionf;
