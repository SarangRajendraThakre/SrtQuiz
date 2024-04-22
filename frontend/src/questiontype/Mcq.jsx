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
  // Other state variables and functions...

  // Function to update question by ID

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [questiontype, setQuestionType] = useState("MCQ");
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({});

  const fileInputRef = useRef(null);

  useEffect(() => {
    // Ensure that questionIdd is set before calling getQuestionById
    if (questionIdd && quizData) {
      const foundQuestion = getQuestionById();
      setQuestion(foundQuestion ? foundQuestion.questionText : "");

      setImagePath(foundQuestion ? foundQuestion.imagePath : "");

      setAnswers(foundQuestion && Array.isArray(foundQuestion.options) ? foundQuestion.options : ["", "", "", ""]);
      

      setCorrectAnswerIndex(foundQuestion && Array.isArray(foundQuestion.correctAnswers) ? foundQuestion.correctAnswers : ["", "", "", ""]);

      // Set question text or empty string if question not found
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
    newAnswers[index] = e.target.value; // Use e.target.value to get the typed value
    setAnswers(newAnswers);
  };

  const handleSelectCorrectAnswer = (index) => {
    // Toggle the correct answer index
    const newCorrectAnswerIndex =
      correctAnswerIndex === index ?  null : index; // Toggle to null if already selected, otherwise set to the current index
    setCorrectAnswerIndex(newCorrectAnswerIndex);
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      setImage(file);

      if (!imagePath) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadResponse = await axios.post(
          "http://localhost:5000/api/upload",
          formData
        );
        setImagePath(uploadResponse.data.imagePath);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      let uploadedImagePath = "";

      if (imagePath) {
        uploadedImagePath = imagePath;
      }

      let createdQuizId = localStorage.getItem("createdQuizId");

      if (!createdQuizId) {
        // If quiz ID is not found, create an empty quiz
        const response = await axios.post("http://localhost:5000/api/quizzes", {
          title: "",
          visibility: "public",
          folder: "Your Quiz Folder",
          posterImg: "",
        });

        createdQuizId = response.data._id;
        console.log("Empty quiz created:", response.data);

        // Store the created quiz ID in local storage
        localStorage.setItem("createdQuizId", createdQuizId);
      }
      const questionData = {
        question: question,
        answers: answers,
        correctAnswerIndex: correctAnswerIndex,
        questiontype: questiontype,
        imagePath: uploadedImagePath,
        quizId: createdQuizId,
      };

      // Add the question using the addQuestion function from the context
      await addQuestion(questionData);

      // Clear form fields after successful submission
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswerIndex(null);
      setImagePath("");
    } catch (error) {
      console.error("Error creating quiz:", error);
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
        correctAnswerIndex: correctAnswerIndex, // Include correctAnswerIndex in the updated data
        questiontype: questiontype,
        imagePath: imagePath,
        // Assuming quizData contains the quiz object with _id property
      };
  
      // Call the updateQuestionById function from the context
      await updateQuestionById(questionIdd, updatedQuestionData);
  
      // Clear form fields or perform other actions if needed...
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
          backgroundImage: `ul(http://localhost:5000${imagePath})`,
        }}
      >
        <div className="advertise">
          <div className="advertiseinner"></div>
        </div>

        <div className="questiontextinput">
          <div className="innerquestiontextinput">
            <div className="innerquestiontextinputinner">
              <div className="innerquestiontextinputinnerinner">
                <div className="innerquestiontextinputinnerinnerinner">
                  <input
                    className="inputquestion"
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
          type="radio"
          name="option"
          onClick={() => handleSelectCorrectAnswer(index)}
        />
      </div>
      {/* Image icon */}
      {/* Image icon here */}
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
