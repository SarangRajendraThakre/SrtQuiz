import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useQuiz } from "../context/QuizContext";
import ButtonsContainerr from "../components/options/ButtonsContainerr";
import { BsPlusLg } from "react-icons/bs";
import "./Mcq.css";
import { baseUrl1 } from "../utils/services";
import Menudots from "../components/MiddleQtype/Menudots";

const Msq = () => {
  const { updateQuestionById, quizData, questionIdd, getQuestionById } = useQuiz();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [questiontype, setQuestiontype] = useState("MSQ");

  const fileInputRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function to remove the event listener
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
          : ["", "", "", ""]
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
    const indexExists = correctAnswerIndices.includes(index);
    if (indexExists) {
      const newCorrectAnswerIndices = correctAnswerIndices.filter((i) => i !== index);
      setCorrectAnswerIndices(newCorrectAnswerIndices);
    } else {
      const newCorrectAnswerIndices = [...correctAnswerIndices, index];
      setCorrectAnswerIndices(newCorrectAnswerIndices);
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

      const filteredCorrectAnswerIndices = correctAnswerIndices.filter(
        (index) => index !== ""
      );

      const updatedQuestionData = {
        question: question,
        answers: answers,
        correctAnswerIndices: filteredCorrectAnswerIndices,
        imagePath: imagePath,
        questiontype: questiontype,
      };

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
      <div
        className="questiontext"
        style={{
          objectFit: "contain",
          backgroundImage: `ur(${baseUrl1}${quizData.posterImg})`,
        }}
      >
        <div className="advertise">
          <div className="advertiseinner"></div>
        </div>

        <div className="question-title__Container">
          <div className="question-text-field__TitleWrapper">
            <div className="question-text-field__Editor">
              <input
                className="styles__Wrapper innerquestiontextinput styles__ContentEditable styles__Wrapper"
                type="text"
                placeholder="Type question here"
                value={question}
                onChange={handleQuestionChange}
              />
            </div>
          </div>
          {showmenudots && <Menudots />}
        </div>

        <div className="mainmiddlearea">
          <div className="mainmiddleareainner">
            <div className="mainmiddleareainnerinner">
              <div className={imagePath ? "mainmiddleareainnerinnerinnerimg" : "mainmiddleareainnerinnerinner"}>
                {imagePath ? (
                  <div
                    className={imagePath ? "mainmiddleareainnerinnerinnerimg" : "mainmiddleareainnerinnerinner"}
                    onMouseDown={handleImageLongPressStart}
                    onMouseUp={handleImageLongPressEnd}
                    onTouchStart={handleImageLongPressStart}
                    onTouchEnd={handleImageLongPressEnd}
                  >
                    <img
                      className={imagePath && "mainmiddleareainnerinnerinnerimg"}
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
                <ButtonsContainerr
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  onCorrectAnswerChange={handleSelectCorrectAnswer}
                  questiontype={questiontype}
                />
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

export default Msq;