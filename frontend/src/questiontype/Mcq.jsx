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
  const {
    updateQuestionById,
    quizData,
    questionIdd,
    getQuestionById,
    selectedImage,
  } = useQuiz();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [questiontype, setQuestiontype] = useState("MCQ");
  const [explanation, setExplanation] = useState(""); // Correctly handling explanation state

  const fileInputRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = (e) => {
    if (!e.target.value.trim()) {
      setIsFocused(false);
    }
  };

  const backgroundStyle = {
    backgroundImage: `url(${selectedImage})`,
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

      const filteredCorrectAnswers =
        foundQuestion && Array.isArray(foundQuestion.correctAnswers)
          ? foundQuestion.correctAnswers.filter((answer) => answer !== "")
          : [];
      setCorrectAnswerIndices(filteredCorrectAnswers);
      setExplanation(foundQuestion ? foundQuestion.explanationText : ""); // Ensure explanation is set
    }
  }, [questionIdd, quizData]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const longPressTimerRef = useRef(null);

  const handleExplanationChange = (e) => {
    setExplanation(e.target.value); // Correctly update explanation
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
    const indexExists = correctAnswerIndices.includes(index);

    if (indexExists && correctAnswerIndices.length === 1) {
      setCorrectAnswerIndices([]);
      alert("Only one correct answer can be selected for this question.");
    } else {
      setCorrectAnswerIndices([index]);
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
        explanation: explanation, // Make sure explanationText is sent
      };

      setCorrectAnswerIndices([]);

      await updateQuestionById(questionIdd, updatedQuestionData);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  const handleImageLongPressStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setImagePath("");
    }, 500); // 500ms for a long press
  };

  const handleImageLongPressEnd = () => {
    clearTimeout(longPressTimerRef.current);
  };

  return (
    <>
      <div className="questiontext" style={backgroundStyle}>
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
                className={
                  imagePath
                    ? "mainmiddleareainnerinnerinnerimg"
                    : "mainmiddleareainnerinnerinner"
                }
              >
                {imagePath ? (
                  <div
                    className={
                      imagePath
                        ? "mainmiddleareainnerinnerinnerimg"
                        : "mainmiddleareainnerinnerinner"
                    }
                    onMouseDown={handleImageLongPressStart}
                    onMouseUp={handleImageLongPressEnd}
                    onTouchStart={handleImageLongPressStart}
                    onTouchEnd={handleImageLongPressEnd}
                  >
                    <img
                      className={
                        imagePath && "mainmiddleareainnerinnerinnerimg"
                      }
                      src={`${baseUrl1}${imagePath}`}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="mainmiddleareainnerinnerinner">
                    <div className="mainmiddleareainnerinnerinnerinner">
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
                    correctAnswerIndices={correctAnswerIndices}
                    questiontype={questiontype}
                  />
                )}

                <button className="addmore">Add more options</button>
                <button onClick={handleUpdateQuestion}>Save Question</button>
              </div>
            </div>
          </div>
        </div>

        <div className="explanation-container">
          <label className="explanation-label">Explanation</label>
          <textarea
            className="explanation-input"
            value={explanation}
            onChange={handleExplanationChange}
            placeholder="Type the explanation for this question..."
          />
        </div>

        {showmenudots && (
          <div className="menudots-container">
            <PiDotsThreeOutlineVerticalFill fontSize="2em" />
            <Menudots />
          </div>
        )}
      </div>
    </>
  );
};

export default Mcq;
