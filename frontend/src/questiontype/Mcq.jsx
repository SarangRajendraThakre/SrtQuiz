import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useQuiz } from "../context/QuizContext";
import ButtonsContainerr from "../components/options/ButtonsContainerr";
import { BsPlusLg } from "react-icons/bs";
import "./Mcq.css";
import { baseUrl1 } from "../utils/services";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import Menudots from "../components/MiddleQtype/Menudots";

/* 🔒 SAFE URL RESOLVER (LOGIC ONLY) */
const resolveImageUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${baseUrl1}${path}`;
};

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
  const [questiontype] = useState("MCQ");
  const [explanation, setExplanation] = useState("");

  const fileInputRef = useRef(null);
  const longPressTimerRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    if (!e.target.value.trim()) setIsFocused(false);
  };

  /* BACKGROUND — SAME STYLE, SAFE URL */
  const backgroundStyle = selectedImage
    ? { backgroundImage: `url(${resolveImageUrl(selectedImage)})` }
    : {};

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showmenudots = windowWidth < 900;

  useEffect(() => {
    if (!questionIdd || !quizData) return;

    const foundQuestion = getQuestionById();
    if (!foundQuestion) return;

    setQuestion(foundQuestion.questionText || "");
    setImagePath(foundQuestion.imagePath || "");
    setAnswers(
      Array.isArray(foundQuestion.options) ? foundQuestion.options : []
    );
    setCorrectAnswerIndices(
      Array.isArray(foundQuestion.correctAnswers)
        ? foundQuestion.correctAnswers.filter((a) => a !== "")
        : []
    );
    setExplanation(foundQuestion.explanationText || "");
  }, [questionIdd, quizData]);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;

      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post(`${baseUrl1}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImagePath(res.data.imagePath);
      e.target.value = "";
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleImageLongPressStart = () => {
    longPressTimerRef.current = setTimeout(() => setImagePath(""), 500);
  };
  const handleImageLongPressEnd = () => {
    clearTimeout(longPressTimerRef.current);
  };

  const handleUpdateQuestion = async () => {
    if (!questionIdd) return;

    await updateQuestionById(questionIdd, {
      question,
      answers,
      correctAnswerIndices,
      imagePath,
      questiontype,
      explanation,
    });
  };

  return (
    <>
      <div className="questiontext" style={backgroundStyle}>
        <div className="advertise">
          <div className="advertiseinner"></div>
        </div>

        {/* QUESTION INPUT */}
        <div className="question-container">
          <div className="question-title__Container">
            <div className="question-text-field__TitleWrapper">
              <div className="question-text-field__Editor">
                <input
                  className="styles__Wrapper innerquestiontextinput styles__ContentEditable styles__Wrapper"
                  type="text"
                  placeholder={!isFocused ? "Type question here" : ""}
                  value={question}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* IMAGE AREA — SAME STRUCTURE */}
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
                    className="mainmiddleareainnerinnerinnerimg"
                    onMouseDown={handleImageLongPressStart}
                    onMouseUp={handleImageLongPressEnd}
                    onTouchStart={handleImageLongPressStart}
                    onTouchEnd={handleImageLongPressEnd}
                  >
                    <img
                      className="mainmiddleareainnerinnerinnerimg"
                      src={resolveImageUrl(imagePath)}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="mainmiddleareainnerinnerinnerinner">
                    <div className="uploadinnercontent">
                      <div className="uploadimg">
                        <label htmlFor="fileInput" className="uploadbtn">
                          <div className="uploadbtninner">
                            <BsPlusLg fontSize="25px" />
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

                        <label htmlFor="fileInput" className="buttonupload">
                          Select Image
                        </label>
                      </div>

                      <p className="uploaddrag">
                        Upload file or drag here to upload
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* OPTIONS */}
        <div className="optionmainarea">
          <div className="optionmainareainner">
            <div className="optionmainareainnerinner">
              <div className="optionmainareainnerinnerinner">
                {answers.length > 0 && (
                  <ButtonsContainerr
                    answers={answers}
                    onAnswerChange={(i, v) => {
                      const a = [...answers];
                      a[i] = v;
                      setAnswers(a);
                    }}
                    onCorrectAnswerChange={(i) => setCorrectAnswerIndices([i])}
                    correctAnswerIndices={correctAnswerIndices}
                    questiontype={questiontype}
                  />
                )}

                <button onClick={handleUpdateQuestion}>Save Question</button>
              </div>

              {/* EXPLANATION */}
              <div className="question-container">
                <div className="question-title__Container">
                  <div className="question-text-field__TitleWrapper">
                    <div className="question-text-field__Editor">
                      <input
                        className="styles__Wrapper innerquestiontextinput styles__ContentEditable styles__Wrapper"
                        type="text"
                        placeholder={
                          !isFocused
                            ? "Type Explanation of answer or image here"
                            : ""
                        }
                        value={explanation}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={(e) => setExplanation(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showmenudots && <Menudots />}
      </div>
    </>
  );
};

export default Mcq;
