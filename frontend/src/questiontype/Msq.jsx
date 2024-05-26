import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useQuiz } from "../context/QuizContext";
import ButtonsContainerr from "../components/options/ButtonsContainerr";
import { BsPlusLg } from "react-icons/bs";
import "./Mcq.css";
import {  baseUrl1 } from "../utils/services";
import Menudots from "../components/MiddleQtype/Menudots";
const Msq = () => {
  const { updateQuestionById, quizData, questionIdd, getQuestionById } =
    useQuiz();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [questiontype, setQuestiontype] = useState("MSQ");

  const fileInputRef = useRef(null);

 
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
  }, []); //
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
    // Check if the index is already in the array
    const indexExists = correctAnswerIndices.includes(index);
  
    // If the index exists, remove it from the array
    if (indexExists) {
      const newCorrectAnswerIndices = correctAnswerIndices.filter((i) => i !== index);
      setCorrectAnswerIndices(newCorrectAnswerIndices);
    } else {
      // If the index doesn't exist, add it to the array
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
  
      // Filter out empty correct answer indices
      const filteredCorrectAnswerIndices = correctAnswerIndices.filter(index => index !== "");
  
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

         

        <div className="question-title__Container">
          <div className="question-text-field__TitleWrapper">
            <div className="question-text-field__Editor">
             
               
                <input
                  className="styles__Wrapper innerquestiontextinput styles__ContentEditable styles__Wrapper "
                  type="text"
                  name=""
                  id=""
                  placeholder="Type question here"
                  value={question}
                  onChange={handleQuestionChange}
                /></div>
               
            
          
          </div>
        { showmenudots && <Menudots /> } 
        </div>


        {/* <div class="question-title__Container">
          <div
            aria-label="Add question title"
            class="question-text-field__TitleWrapper"
          >
            <div class="question-text-field__Editor ">
              <div class="styles__Wrapper ">
                <div
                  aria-label="Question title. Click to add the title."
                  class="styles__ContentEditable "
                  contenteditable="true"
                  role="textbox"
                  spellcheck="true"
                  data-lexical-editor="true"
              
                  data-editor-value=""
                  data-functional-selector="question-title__input"
                >
                  <p data-placeholder="Start typing your question"></p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="ActionMenu"
            aria-haspopup="true"
          >
            <button
              id="action-menu__toggle-question-action-menu"
              aria-label="Duplicate, delete question or add additional features."
              aria-expanded="false"
              data-functional-selector="action-menu__toggle"
              data-onboarding-step="action-menu__toggle-question-action-menu"
              tabindex="0"
              class="icon-button__ IconButton"
            >
              <span
                class="icon__Icon"
                data-functional-selector="icon"
              
              >
                <svg
                  viewBox="0 0 32 32"
                  focusable="false"
                  stroke="none"
                  stroke-width="0"
                  aria-labelledby="label-47dafd1c-89f8-40c3-bf95-9fda8cace1f1"
                  aria-hidden="true"
                  class="icon__Svg-sc-xvsbpg-1" 
                >
                  <title id="label-47dafd1c-89f8-40c3-bf95-9fda8cace1f1">
                    Icon
                  </title>
                  <path
                    d="M16,10 C17.1045695,10 18,9.1045695 18,8 C18,6.8954305 17.1045695,6 16,6 C14.8954305,6 14,6.8954305 14,8 C14,9.1045695 14.8954305,10 16,10 Z M16,18 C17.1045695,18 18,17.1045695 18,16 C18,14.8954305 17.1045695,14 16,14 C14.8954305,14 14,14.8954305 14,16 C14,17.1045695 14.8954305,18 16,18 Z M16,26 C17.1045695,26 18,25.1045695 18,24 C18,22.8954305 17.1045695,22 16,22 C14.8954305,22 14,22.8954305 14,24 C14,25.1045695 14.8954305,26 16,26 Z"
                    style="fill: rgb(51, 51, 51);"
                  ></path>
                </svg>
              </span>
            </button>
          </div>
        </div> */}

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
                            {/* Trigger file input field click on icon click */}
                            <label htmlFor="fileInput" className="uploadbtn">
                              <div className="uploadbtninner">
                                <span className="spanicon">
                                  <BsPlusLg fontSize="25px" />
                                </span>
                              </div>
                            </label>
                            {/* Hidden file input field */}
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
                {/* Render the ButtonsContainerr component */}
                <ButtonsContainerr
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                  onCorrectAnswerChange={handleSelectCorrectAnswer}
                  questiontype={questiontype}
                />
                {/* Button for adding more options */}
                <button className="addmore">Add more options</button>
                {/* Button for submitting the question */}
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
