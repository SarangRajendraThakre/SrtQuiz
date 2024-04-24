
import "./Mcq.css";
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { GoPlus } from "react-icons/go";
import { IoTriangleSharp } from "react-icons/io5";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import { Bs0Square, BsDiamondFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BiSolidImage } from "react-icons/bi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BsPlusLg } from "react-icons/bs";
import { BiCircle } from "react-icons/bi";
import { useQuiz } from "../context/QuizContext";

const Mcq = () => {
  const {
    addQuestion,
    updateQuestionById,
    quizData,
    questionIdd,
    getQuestionById,
  } = useQuiz();

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndices, setCorrectAnswerIndices] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [questiontype,setQuestiontype]=useState("MCQ");

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (questionIdd && quizData) {
      const foundQuestion = getQuestionById();
      setQuestion(foundQuestion ? foundQuestion.questionText : "");
      setImagePath(foundQuestion ? foundQuestion.imagePath : "");
      setAnswers(foundQuestion && Array.isArray(foundQuestion.options) ? foundQuestion.options : ["", "", "", ""]);
      setCorrectAnswerIndices(foundQuestion && Array.isArray(foundQuestion.correctAnswers) ? foundQuestion.correctAnswers : []);
    }
  }, [questionIdd, quizData]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.value;
    setAnswers(newAnswers);
  };           

  const handleSelectCorrectAnswer = (index) => {
    const newCorrectAnswerIndices = correctAnswerIndices.includes(index)
      ? correctAnswerIndices.filter((i) => i !== index)
      : [...correctAnswerIndices, index];
    setCorrectAnswerIndices(newCorrectAnswerIndices);
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData);
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
        questiontype:questiontype
      };

      await updateQuestionById(questionIdd, updatedQuestionData);
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };

  return (
    <>
      <div className="questiontext" style={{ objectFit: "contain", backgroundImage: `url(http://localhost:500${imagePath})` }}>
        <div className="advertise">
          <div className="advertiseinner"></div>
        </div>

        <div className="questiontextinput">
          <div className="innerquestiontextinput">
            <div className="innerquestiontextinputinner">
              <div className="innerquestiontextinputinnerinner">
                <div className="innerquestiontextinputinnerinnerinner">
                  <div className="inputquestion"><input
                    className=""
                    type="text"
                    name=""
                    id=""
                    placeholder="Type question here"
                    value={question}
                    onChange={handleQuestionChange}
                  /></div>
                  
                </div>
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
                {/* Render each option card */}
                {answers.map((answer, index) => (
  <div className="optioncard" key={index}>
    {/* Render icon based on index */}
    <div className={`optioncardinner color${index + 1}`}>
      {/* Icons here */}
    </div>
    {/* Input field for the answer */}
    <div className="optioncardinnermain">
      <span className="ocim">
        <div className="ocimh">
          <div className="ocimhh">
            <div className="answertexthere">
              <textarea 
                 className="answertexthereinner"
                placeholder={`Add answer ${index + 1}`}
                value={answer}
                onChange={(e) => handleAnswerChange(e, index)}
              ></textarea>
            </div>
          </div>
        </div>
      </span>
      {/* Radio button for selecting the correct answer */}
      <div className="radiobtn">
      <input
  type="checkbox"
  checked={correctAnswerIndices.includes(index)}

  onChange={(e) => handleSelectCorrectAnswer(index, e)}
  value={answers[index]} // Pass the value of the answer to the checkbox
/>


      </div>
   
    </div>
  </div>
))}
                {/* Button for adding more options */}
                <button className="addmore">Add more options</button>
                {/* Button for submitting the question */}
                <button onClick={handleUpdateQuestion}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default Mcq;
