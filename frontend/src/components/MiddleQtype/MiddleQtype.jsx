import React, { useState, useContext } from "react";
import "./MiddleQtype.css";
import Mcq from "../../questiontype/Mcq.jsx";
import TrueFalse from "../../questiontype/TrueFalse.jsx";
import Rightside from "../Rightsidebar/Rightside.jsx";
import Msq from "../../questiontype/Msq.jsx";

import { useQuiz } from "../../context/QuizContext.jsx"; // Import the QuizContext

const MiddleQtype = () => {
  // Use useContext to access the context
  const { questionType, questionIdd } = useQuiz();

  console.log(questionType, questionIdd);
  return (
    <div className="srt">
      {questionType === null && <Msq />}
      {questionType === "True/False" && <TrueFalse />}
      {questionType === "MCQ" && <Mcq />}
      {questionType === "MSQ" && <Msq />}

      <Rightside />
    </div>
  );
};

export default MiddleQtype;
