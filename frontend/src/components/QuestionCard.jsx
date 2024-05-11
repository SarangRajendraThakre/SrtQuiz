import React, { useState, useEffect } from "react";
import { BiImage } from "react-icons/bi";
import { useQuiz } from "../context/QuizContext";
import "./Sidebar.css"

function QuestionCard({ question, index, isNew, isSelected, onClick }) {
  const [added, setAdded] = useState(false);

  const { quizData, deleteQuestionById } = useQuiz();

  if (!question) {
    return <div>Loading...</div>; // or any other placeholder or loading indicator
  }

  const { questionText, answers, imagePath, questionType } = question;

  const handleClick = () => {
    onClick(questionType, index, question._id);
  };

  const handleDelete = () => {
    deleteQuestionById(question._id);
  };

  useEffect(() => {
    if (isNew) {
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 1000);
    }
  }, [isNew, quizData]);

  if (!quizData || !quizData.questions) {
    return <div>No questions available</div>;
  }

  console.log("isNew:", isNew, "isSelected:", isSelected); // Log isNew and isSelected

  return (
    <div className={`card ${added ? "bounce" : ""} `}>
      <div className="question-card" onClick={handleClick}>
        <div className="card-title-container">
          <div className="card-no noofquestion ">{index + 1}</div>
          <div className="card-title">{question.questionType}</div>
        </div>
        <div className="cardcontent">
          <div className="maincardcontent">
            <div className={`maincardcontentinner ${isSelected ? "maincardcontentselection" : ""}`}>
              <div className="maincardcontentinnerheading">
                {quizData ? question.questionText : "Question"}
              </div>
              <div className="maincardcontentinnerimage">
                <div className="maincardcontentinnerimagecountdown"></div>
                <div className="maincardcontentinnerimagecontainer">
                  {imagePath ? (
                    <div className="maincardcontentinnerimagecontainerinnerpath">
                      <span className="imgpostinquestincard">
                        <img
                          className=""
                          src={`http://localhost:5000${imagePath}`}
                          alt=""
                        />
                      </span>
                    </div>
                  ) : (
                    <div className="maincardcontentinnerimagecontainerinner">
                      <BiImage />
                    </div>
                  )}
                </div>
              </div>
              <div className="maincardcontentinneroptioncontainer">
                {question.options &&
                  question.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`maincardcontentinneroptioncontainerinner ${
                        option === question.correctAnswer ? "correct-answer" : ""
                        }`}
                    >
                      {option}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="cardsidebar">
            <span className="icons-side copyicon">
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 32 32"
                focusable="false"
                stroke="none"
                strokeWidth="0"
                aria-labelledby="label-1e0058cb-d1de-43ed-857f-bde426ba678e"
                aria-hidden="true"
              >
                <title id="label-1e0058cb-d1de-43ed-857f-bde426ba678e">
                  copy
                </title>
                <path
                  d="M25,21 L12,21 C10.897,21 10,20.103 10,19 L10,10 C10,8.896 10.897,8 12,8 L25,8 C26.103,8 27,8.896 27,10 L27,19 C27,20.102 26.103,21 25,21 Z M20,25 L8,25 C6.897,25 6,24.103 6,23 L6,13 L8,13 L8,23 L20,23 L20,25 Z M12,10 L12,19 L25.001,19 L25,10 L12,10 Z"
                  style={{ fill: "rgb(110, 110, 110)" }}
                ></path>
              </svg>
            </span>
            <span className="icons-side deleteicon" onClick={handleDelete}>
              <svg
                viewBox="0 0 32 32"
                width="20px"
                height="20px"
                focusable="false"
                stroke="none"
                strokeWidth="0"
                aria-labelledby="label-abc58edb-ec86-4095-940a-7ed80f11543c"
                aria-hidden="true"
              >
                <title id="label-abc58edb-ec86-4095-940a-7ed80f11543c">
                  delete
                </title>
                <path
                  d="M9,24 C9,25.103 9.897,26 11,26 L21,26 C22.103,26 23,25.103 23,24 L23,12 L9,12 L9,24 Z M11,14 L21,14 L21.001,24 L11,24 L11,14 Z M19,9 L25,9 L25,11 L7,11 L7,9 L13,9 L13,7 L19,7 L19,9 Z M13,16 L13,22 L15,22 L15,16 L13,16 Z M17,16 L17,22 L19,22 L19,16 L17,16 Z"
                  style={{ fill: "rgb(110, 110, 110)" }}
                ></path>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionCard;
