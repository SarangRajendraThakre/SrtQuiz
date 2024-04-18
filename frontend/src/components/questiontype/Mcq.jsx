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




const Mcq = () => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(null);
  const [imagePath, setImagePath] = useState(""); // Store the image path
  const [questiontype, setQuestionType] = useState("MCQ");
  const [image, setImage] = useState(null); // Store the selected image file

  const fileInputRef = useRef(null);

  // Function to handle file input field click
  const handleUploadClick = () => {
    fileInputRef.current.click(); // Trigger click event of file input field
  };
  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };
  
  const handleAnswerChange = (e, index) => {
    const newAnswers = [...answers];
    newAnswers[index] = e.target.innerText; // Use innerText to get the content
    setAnswers(newAnswers);
  };
  

  const handleSelectCorrectAnswer = (index) => {
    setCorrectAnswerIndex(index);
  };
  
  // Function to handle image change
  const handleImageChange = async (e) => {
    try {
      const file = e.target.files[0];
      setImage(file); // Store the selected image file
  
      // Check if there's no imagePath already set
      if (!imagePath) {
        // If no imagePath exists, upload the image
        // Create a FormData object
        const formData = new FormData();
        formData.append("image", file);
  
        // Upload the image file
        const uploadResponse = await axios.post("http://localhost:5000/api/upload", formData);
  
        // Set the image path to the uploaded image's path
        setImagePath(uploadResponse.data.imagePath);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error
    }
  };
  const handleSubmit = async () => {
    try {
      let uploadedImagePath = ""; // Initialize uploadedImagePath to an empty string
  
      // Check if an image is already uploaded and imagePath is not empty
      if (imagePath) {
        // If imagePath is not empty, use the existing image path
        uploadedImagePath = imagePath;
      }
  
      // Get the createdQuizId from local storage
      const createdQuizId = localStorage.getItem('createdQuizId');
  
      // Check if createdQuizId exists
      if (!createdQuizId) {
        console.error('Created Quiz ID not found in local storage');
        return; // Exit the function if createdQuizId is not found
      }
  
      // Send the question data along with the image path and other required fields to the backend
      const questionData = {
        question: question,
        answers: answers,
        correctAnswerIndex: correctAnswerIndex,
        questiontype: questiontype, // Include questiontype field
        imagePath: uploadedImagePath,
        quizId: createdQuizId // Include createdQuizId as quizId in the request data
      };
  
      // Make the API call to add the question
      const addQuestionResponse = await axios.post("http://localhost:5000/api/add-question", questionData);
      
      // Log the response from the backend
      console.log("Question added successfully:", addQuestionResponse.data);
  
      // Clear form fields after successful submission
      setQuestion("");
      setAnswers(["", "", "", ""]);
      setCorrectAnswerIndex(null);
      setImagePath("");
    } catch (error) {
      console.error("Error adding question:", error);
      // Handle error
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
