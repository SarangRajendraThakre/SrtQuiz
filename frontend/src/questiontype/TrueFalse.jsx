import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useQuiz } from "../context/QuizContext";
import ButtonsContainerr from "../components/options/ButtonsContainerr";
import { BsPlusLg } from "react-icons/bs";
import "./Mcq.css";
import { baseUrl1 } from "../utils/services";
import Menudots from "../components/MiddleQtype/Menudots";

/* 🔒 SAFE IMAGE URL RESOLVER */
const resolveImageUrl = (path) => {
  if (!path) return "";
  return path.startsWith("http") ? path : `${baseUrl1}${path}`;
};

const TrueFalse = () => {
  const { updateQuestionById, quizData, questionIdd, getQuestionById } =
    useQuiz();

  const fileInputRef = useRef(null);

  const [question, setQuestion] = useState("");
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [questiontype] = useState("True/False");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
    setCorrectAnswerIndices(
      Array.isArray(foundQuestion.correctAnswers)
        ? foundQuestion.correctAnswers
        : []
    );
  }, [questionIdd, quizData]);

  const handleQuestionChange = (e) => setQuestion(e.target.value);

  const handleSelectCorrectAnswer = (index) => {
    setCorrectAnswerIndices([index]); // only one correct for True/False
  };

  /* IMAGE UPLOAD — SINGLE CLICK */
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
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleUpdateQuestion = async () => {
    if (!questionIdd) return;

    await updateQuestionById(questionIdd, {
      question,
      answers: ["True", "False"],
      correctAnswerIndices,
      imagePath,
      questiontype,
    });
  };

  return (
    <>
      <div className="questiontext">
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

        {/* IMAGE AREA — SAME STYLING */}
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
                  <div className="mainmiddleareainnerinnerinnerimg">
                    <img
                      className="mainmiddleareainnerinnerinnerimg"
                      src={resolveImageUrl(imagePath)}
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="mainmiddleareainnerinnerinner">
                    <div className="mainmiddleareainnerinnerinnerinner">
                      <div className="uploadinnercontent">
                        <div className="uploadimg">
                          <div className="uploadimgurl"></div>

                          {/* ✅ LABEL ONLY */}
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

                          <label
                            htmlFor="fileInput"
                            className="buttonupload"
                          >
                            Select Image
                          </label>
                        </div>

                        <div className="uploadingmessage">
                          <p className="uploaddrag">
                            Upload file or drag here to upload
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

        {/* OPTIONS */}
        <div className="optionmainarea">
          <div className="optionmainareainner">
            <div className="optionmainareainnerinner">
              <div className="optionmainareainnerinnerinner">
                <ButtonsContainerr
                  answers={["True", "False"]}
                  onCorrectAnswerChange={handleSelectCorrectAnswer}
                  questiontype={questiontype}
                />
                <button onClick={handleUpdateQuestion}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrueFalse;
