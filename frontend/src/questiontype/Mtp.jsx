import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useQuiz } from "../context/QuizContext";
import ButtonsContainerr from "../components/options/ButtonsContainerr";
import { BsPlusLg } from "react-icons/bs";
import "./mtp.css";
import Matching from "./Matching";
import { baseUrl1 } from "../utils/services";


const Mtp = () => {
  const { updateQuestionById, quizData, questionIdd, getQuestionById } = useQuiz();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [questiontype, setQuestiontype] = useState("MSQ");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (questionIdd && quizData) {
      const foundQuestion = getQuestionById();
      setQuestion(foundQuestion ? foundQuestion.questionText : "");
      setImagePath(foundQuestion ? foundQuestion.imagePath : "");
      setAnswers(
        foundQuestion && Array.isArray(foundQuestion.options)
          ? foundQuestion.options
          : ["", "", "", ""]
      );
      setCorrectAnswerIndices(
        foundQuestion && Array.isArray(foundQuestion.correctAnswers)
          ? foundQuestion.correctAnswers
          : []
      );
    }
  }, [questionIdd, quizData]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (index, updatedAnswer) => {
    const newAnswers = [...answers];
    newAnswers[index] = updatedAnswer;
    setAnswers(newAnswers);
  };

  const handleSelectCorrectAnswer = (index) => {
    let newCorrectAnswerIndices;

    const indexExists = correctAnswerIndices.includes(index);

    if (indexExists) {
      newCorrectAnswerIndices = correctAnswerIndices.filter((i) => i !== index);
    } else {
      newCorrectAnswerIndices = [...correctAnswerIndices, index];
    }

    setCorrectAnswerIndices(newCorrectAnswerIndices);
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const uploadResponse = await axios.post(`${baseUrl1}/api/upload`, formData);
      setImagePath(uploadResponse.data.imagePath);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      if (!questionIdd || !quizData) {
        console.error("Question ID or quiz data not available");
        return;
      }

      const updatedQuestionData = {
        question: question,
        answers: answers,
        correctAnswerIndices: correctAnswerIndices,
        imagePath: imagePath,
        questiontype: questiontype,
      };

      await updateQuestionById(questionIdd, updatedQuestionData);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <>
      <div
        className="questiontext"
        style={{
          objectFit: "contain",
          backgroundImage: `url(${baseUrl1}${quizData.posterImg})`,
        }}
      >
        <div className="advertise">
          <div className="advertiseinner"></div>
        </div>

        <div className="questiontextinput">
          <div className="innerquestiontextinput">
            <div className="innerquestiontextinputinnerinner">
              <div className="innerquestiontextinputinnerinnerinner">
                <input
                  type="text"
                  placeholder="Type question here"
                  value={question}
                  onChange={handleQuestionChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="options-container">
          {answers.map((answer, index) => (
            <div key={index} className="option">
              <input
                type="text"
                placeholder={`Add answer ${index + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleSelectCorrectAnswer(index)}
                className={correctAnswerIndices.includes(index) ? "selected" : ""}
              >
                {correctAnswerIndices.includes(index) ? "Deselect" : "Select"}
              </button>
            </div>
          ))}
        </div>

        <div className="upload-image">
          <button onClick={handleUploadClick}>
            <BsPlusLg />
            Upload Image
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
          {imagePath && <img src={`${baseUrl1}${imagePath}`} alt="Uploaded" />}
        </div>

        

      

      </div>
    </>
  );
};

export default Mtp;
