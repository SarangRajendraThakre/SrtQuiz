import React, { useState, useContext } from "react";
import "./Questionf.css";
import Mcq from "../questiontype/Mcq.jsx";
import TrueFalse from "../questiontype/TrueFalse.jsx";
import Rightside from "./Rightside.jsx";
import Msq from '../questiontype/Msq.jsx';
import {  useQuiz } from "../context/QuizContext"; // Import the QuizContext

const Questionf = () => {
  // Use useContext to access the context
  const { questionType } = useQuiz();

  console.log(questionType);
  return (
    <div className="srt">
      {questionType === null && <Mcq/>}
      {questionType === "True/False" && <TrueFalse />}
      {questionType === "MCQ" && <Mcq />}
      {questionType === "MSQ" && <Msq/>}
      <Rightside/>
    </div>
  );
};

export default Questionf;
