import React, { useState, useContext, useEffect } from "react";
import "./MiddleQtype.css";
import Mcq from "../../questiontype/Mcq.jsx";
import TrueFalse from "../../questiontype/TrueFalse.jsx";
import Msq from "../../questiontype/Msq.jsx";
import Mtp from "../../questiontype/Mtp.jsx";
import Rightside from "../Rightsidebar/Rightside.jsx";
import { useQuiz } from "../../context/QuizContext.jsx"; // Import the QuizContext
import Nat from "../../questiontype/Nat.jsx";

const MiddleQtype = () => {
  const { questionType, questionIdd } = useQuiz();
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
  }, []); // Empty dependency array to run the effect only once

  const showRightside = windowWidth >= 900;

  return (
    <div className="srt">
      {questionType === null && <Msq />}
      {questionType === "True/False" && <TrueFalse />}
      {questionType === "NAT" && <Nat />}
      {questionType === "MSQ" && <Msq />}
      {questionType === "MCQ" && <Mcq />}

      {showRightside && <Rightside  />}
    </div>
  );
};

export default MiddleQtype;
