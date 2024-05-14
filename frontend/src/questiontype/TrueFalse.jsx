import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useQuiz } from "../context/QuizContext";
import ButtonsContainerr from "../components/options/ButtonsContainerr";
import { BsPlusLg } from "react-icons/bs";
import "./Mcq.css";

const TrueFalse = () => {
  const { updateQuestionById, quizData, questionIdd, getQuestionById } = useQuiz();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [questiontype, setQuestiontype] = useState("True/False");

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      if (questionIdd && quizData) {
        try {
          const foundQuestion = await getQuestionById(questionIdd);
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
              : ["", "", "", ""]
          );
        } catch (error) {
          console.error("Error fetching question data:", error);
        }
      }
    };
  
    fetchData();
  }, [questionIdd, quizData]); // Include questionIdd as a dependency
  
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
  
    if (questiontype === "True/False") {
      newCorrectAnswerIndices = [index];
    } else {
      const indexExists = correctAnswerIndices.includes(index);
      if (indexExists) {
        newCorrectAnswerIndices = correctAnswerIndices.filter((i) => i !== index);
      } else {
        newCorrectAnswerIndices = [...correctAnswerIndices, index];
      }
    }
  
    setCorrectAnswerIndices(newCorrectAnswerIndices);
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
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      if (!questionIdd || !quizData) {
        console.error("Question ID or quiz data not available");
        return;
      }
  
      const updatedAnswers = [...answers];
      updatedAnswers[0] = "True";
      updatedAnswers[1] = "False";
  
      const updatedCorrectAnswerIndices = correctAnswerIndices.length > 0 ? [0] : [];
  
      const updatedQuestionData = {
        question: question,
        answers: updatedAnswers,
        correctAnswerIndices: updatedCorrectAnswerIndices,
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
          backgroundImage: `url(http://localhost:5000${quizData.posterImg})`,
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
                  className=""
                  type="text"
                  name=""
                  id=""
                  placeholder="Type question here"
                  value={question}
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
                      src={`http://localhost:5000${imagePath}`}
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

export default TrueFalse;
