import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useQuiz } from "../context/QuizContext";
import ButtonsContainerr from "../components/options/ButtonsContainerr";
import { BsPlusLg } from "react-icons/bs";
import "./Mcq.css";
import { baseUrl1 } from "../utils/services";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import Menudots from "../components/MiddleQtype/Menudots";

const Mcq = () => {
  const { updateQuestionById, quizData, questionIdd, getQuestionById } = useQuiz();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [questiontype, setQuestiontype] = useState("MCQ");

  const fileInputRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (!e.target.value.trim()) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showmenudots = windowWidth < 900;

  useEffect(() => {
    if (questionIdd && quizData) {
      const foundQuestion = getQuestionById();
      setQuestion(foundQuestion ? foundQuestion.questionText : "");
      setImagePath(foundQuestion ? foundQuestion.imagePath : "");
      setAnswers(
        foundQuestion && Array.isArray(foundQuestion.options)
          ? foundQuestion.options
          : []
      );
      
      // Filter out empty values from the correctAnswers array
      const filteredCorrectAnswers = (foundQuestion && Array.isArray(foundQuestion.correctAnswers))
        ? foundQuestion.correctAnswers.filter(answer => answer !== "")
        : [];
      setCorrectAnswerIndices(filteredCorrectAnswers);
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
    // Check if the index is already in the array of correct answers
    const indexExists = correctAnswerIndices.includes(index);
  
    if (indexExists) {
      // If the index exists, remove it from the array
      const updatedCorrectAnswers = correctAnswerIndices.filter((idx) => idx !== index);
      setCorrectAnswerIndices(updatedCorrectAnswers);
    } else {
      // If the index does not exist, add it to the array
      const updatedCorrectAnswers = [...correctAnswerIndices, index];
      setCorrectAnswerIndices(updatedCorrectAnswers);
    }
  };
  

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const uploadResponse = await axios.post(
        `${baseUrl1}/api/upload`,
        formData
      );
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
  
      // Clear previous correct answers
      setCorrectAnswerIndices([]);
      
      // Update the question
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
          backgroundImage: `urls( ${baseUrl1}${quizData.posterImg})`,
        }}
      >
        <div className="advertise">
          <div className="advertiseinner"></div>
        </div>

        <div className="question-container">
          <div className="question-title__Container">
            <div className="question-text-field__TitleWrapper">
              <div className="question-text-field__Editor">
                <input
                  className="styles__Wrapper innerquestiontextinput styles__ContentEditable styles__Wrapper "
                  type="text"
                  placeholder={!isFocused ? "Type question here" : ""}
                  value={question}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={handleQuestionChange}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mainmiddlearea">
          <div className="mainmiddleareainner">
            <div className="mainmiddleareainnerinner">
              <div
                className={`${
                  imagePath
                    ? "mainmiddleareainnerinnerinnerimg"
                    : "mainmiddleareainnerinnerinner"
                }`}
              >
                {imagePath ? (
                  <div
                    className={`${
                      imagePath
                        ? "mainmiddleareainnerinnerinnerimg"
                        : "mainmiddleareainnerinnerinner"
                    }`}
                  >
                    <img
                      className={` ${
                        imagePath && "mainmiddleareainnerinnerinnerimg"
                      }`}
                      src={`${baseUrl1}${imagePath}`}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="mainmiddleareainnerinnerinner">
                    <div className="mainmiddleareainnerinnerinnerinner">
                      {imagePath ? (
                        <div className="uploadinnercontent"></div>
                      ) : (
                        <div className="uploadinnercontent">
                          <div className="uploadimg">
                            <div className="uploadimgurl"></div>
                            <label htmlFor="fileInput" className="uploadbtn">
                              <div className="uploadbtninner">
                                <span className="spanicon">
                                  <BsPlusLg fontSize="25px" />
                                </span>
                              </div>
                            </label>
                            <input
                              ref={fileInputRef}
                              id="fileInput"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              style={{ display: "none" }}
                            />
                            <button onClick={handleUploadClick}>
                              Select Image
                            </button>
                          </div>
                          <div className="uploadingmessage">
                            <p className="uploaddrag">
                              <button className="buttonupload">
                                Upload file
                              </button>{" "}
                              or drag here to upload
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="optionmainarea">
          <div className="optionmainareainner">
            <div className="optionmainareainnerinner">
              <div className="optionmainareainnerinnerinner">
                {answers.length > 0 && (
                  <ButtonsContainerr
                    answers={answers}
                    onAnswerChange={handleAnswerChange}
                    onCorrectAnswerChange={handleSelectCorrectAnswer}
                    correctAnswerIndices={correctAnswerIndices}  // Add this line
                    questiontype={questiontype}
                  />
                )}
                <button className="addmore">Add more options</button>
                <button onClick={handleUpdateQuestion}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mcq;
