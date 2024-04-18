import "./Mcq.css";
import React, { useState, useRef } from "react";
import axios from 'axios';
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
  const { addQuestion } = useQuiz(); // Destructure addQuestion function from the context

  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [imagePath, setImagePath] = useState("");
  const [questiontype, setQuestionType] = useState("MCQ");
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({});

  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };
  
  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.innerText;
    setAnswers(newAnswers);
  };

  const handleSelectCorrectAnswer = (index) => {
    setCorrectAnswerIndex(index);
  };

  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      setImage(file);
  
      if (!imagePath) {
        const formData = new FormData();
        formData.append("image", file);
  
        const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData);
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
      
      let createdQuizId = localStorage.getItem('createdQuizId');
  
      if (!createdQuizId) {
        // If quiz ID is not found, create an empty quiz
        const response = await axios.post('http://localhost:5000/api/quizzes', {
          title: '',
          visibility: 'public',
          folder: 'Your Quiz Folder',
          posterImg: ''
        });
  
        createdQuizId = response.data._id;
        console.log('Empty quiz created:', response.data);
  
        // Store the created quiz ID in local storage
        localStorage.setItem('createdQuizId', createdQuizId);
      }
      const questionData = {
        question: question,
        answers: answers,
        correctAnswerIndex: correctAnswerIndex,
        questiontype: questiontype,
        imagePath: uploadedImagePath,
        quizId: createdQuizId
      };
  
      // Add the question using the addQuestion function from the context
      await addQuestion(questionData);
  
      // Clear form fields after successful submission
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswerIndex(null);
      setImagePath("");
  
  
      // Clear form fields and close modal
   
     
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };
  
  return (
    <>
      <div className="questiontext">
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
              <div className="mainmiddleareainnerinner">
              <div className="mainmiddleareainnerinnerinner">
  <div className="mainmiddleareainnerinnerinnerinner">
    <div className="uploadinnercontent">
      { !imagePath && (
        <>
          <div className="uploadimg">
            <div className="uploadimgurl">
              {imagePath && <img src={`http://localhost:5000${imagePath}`} alt="Uploaded" />}
            </div>
            {/* Trigger file input field click on icon click */}
            <label htmlFor="fileInput" className="uploadbtn" >
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
            <button onClick={handleUploadClick}>Select Image</button>
          </div>
          <div className="uploadingmessage">
            <p className="uploaddrag">
              <button className="buttonupload">
                Upload file
              </button>{" "}
              or drag here to upload
            </p>
          </div>
        </>
      )}
      {imagePath && (
        <div className="uploadedImage">
          <img src={`http://localhost:5000${imagePath}`} alt="Uploaded" />
         
        </div>
      )}
    </div>
  </div>
</div>


              </div>
            </div>
          </div>
        </div>

        <div className="optionmainarea">
          <div className="optionmainareainner">
            {" "}
            <div className="optionmainareainnerinner">
              <div className="optionmainareainnerinnerinner">
                <div className="optioncard">
                  <div className="optioncardinner color1">
                    <span className="optioncardinnerspan">
                      <IoTriangleSharp fontSize="35px" color="white" />
                    </span>
                  </div>
                  <div className="optioncardinnermain">
                    <span className="ocim">
                      <div className="ocimh">
                        <div className="ocimhh">
                        <div className="answertexthere" contentEditable="true" type="text"
                              placeholder="add answer 1"
                              value={answers[0]}
                            onInput={(e) => handleAnswerChange(e, 0)}>
                          
                          </div>
                        </div>
                      </div>
                    </span>
                    <div className="radiobtn">
                      <input
                        type="radio"
                        name="option"
                        onClick={() => handleSelectCorrectAnswer(0)}
                      />
                    </div>
                    <BiSolidImage size="40px" />
                  </div>
                </div>
                <div className="optioncard">
                  <div className="optioncardinner color2">
                    <span className="optioncardinnerspan">
                      <BsDiamondFill fontSize="35px" color="white" />
                    </span>
                    <div className="optioncardinnermain">
                      <div className="optioncardinnermaintext"></div>
                      <div className="buttonimg"></div>
                    </div>
                  </div>
                  <div className="optioncardinnermain">
                    <span className="ocim">
                      <div className="ocimh">
                        <div className="ocimhh">
                        <div className="answertexthere" contentEditable="true" type="text"
                              placeholder="add answer 1"
                              value={answers[1]}
                              onInput={(e) => handleAnswerChange(e, 1)}>
                          
                          </div>
                        </div>
                      </div>
                    </span>
                    <div className="radiobtn">
                      <input
                        type="radio"
                        name="option"
                        onClick={() => handleSelectCorrectAnswer(1)}
                      />
                    </div>
                    <BiSolidImage size="40px"/>
                  </div>
                </div>
                <div className="optioncard">
                  <div className="optioncardinner color3">
                    <span className="optioncardinnerspan">
                      <FaCircle fontSize="30px" color="white" />
                    </span>
                    <div className="optioncardinnermain">
                      <div className="optioncardinnermaintext"></div>
                    </div>
                  </div>
                  <div className="optioncardinnermain">
                    <span className="ocim">
                      <div className="ocimh">
                        <div className="ocimhh">
                          <div className="answertexthere" contentEditable="true" type="text"
                              placeholder="add answer 1"
                              value={answers[2]}
                              onInput={(e) => handleAnswerChange(e, 2)}>
                          
                             
                          
                          </div>
                        </div>
                      </div>
                    </span>
                    <div className="radiobtn">
                      <input
                        type="radio"
                        name="option"
                        onClick={() => handleSelectCorrectAnswer(2)}
                      />
                    </div>
                    <BiSolidImage size="40px"/>
                  </div>
                </div>
                
                <div className="optioncard">
                  <div className="optioncardinner color4">
                    <span className="optioncardinnerspan">
                      <FaSquareFull fontSize="25px" color="white" />
                    </span>
                    <div className="optioncardinnermain">
                      <div className="optioncardinnermaintext"></div>
                    </div>
                  </div>
                  <div className="optioncardinnermain">
                    <span className="ocim">
                      <div className="ocimh">
                        <div className="ocimhh">
                        <div className="answertexthere" contentEditable="true" type="text"
                              placeholder="add answer 1"
                              value={answers[3]}
                              onInput={(e) => handleAnswerChange(e, 3)}>
                          
                          </div>
                        </div>
                      </div>
                    </span>
                    <div className="radiobtn">
                      <input
                        type="radio"
                        name="option"
                        onClick={() => handleSelectCorrectAnswer(3)}
                      />
                    </div>
                    <BiSolidImage size="40px"/>
                  </div>
                </div>
              </div>{" "}
              <button className="addmore">Add more options</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        </div>
      </div>{" "}
      
    </>
  );
};

export default Mcq;
