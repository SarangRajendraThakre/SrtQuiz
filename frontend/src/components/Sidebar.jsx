import React, { useState, useEffect, useRef } from "react";
import "./Sidebar.css";
import { BiImage } from "react-icons/bi";

function QuestionCard({ questionType, index, isNew, logData, onDelete }) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (isNew) {
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 1000);
    }
  }, [isNew]);

  return (
    <div className={`card ${added ? "bounce" : ""}`}>
      <div className="question-card">
        <div className="card-title-container">
          <div className="card-no noofquestion ">{index + 1}</div>
          <div className="card-title">{questionType}</div>
        </div>
        <div className="cardcontent">
          <div className="maincardcontent">
            <div className="maincardcontentinner">
              <div className="maincardcontentinnerheading">Question</div>
              <div className="maincardcontentinnerimage">
                <div className="maincardcontentinnerimagecountdown"></div>
                <div className="maincardcontentinnerimagecontainer">
                  <div className="maincardcontentinnerimagecontainerinner">
                    <BiImage />
                  </div>
                </div>
              </div>
              <div className="maincardcontentinneroptioncontainer">
                <div className="maincardcontentinneroptioncontainerinner"></div>
                <div className="maincardcontentinneroptioncontainerinner"></div>
                <div className="maincardcontentinneroptioncontainerinner"></div>
                <div className="maincardcontentinneroptioncontainerinner"></div>
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
                  Icon
                </title>
                <path
                  d="M25,21 L12,21 C10.897,21 10,20.103 10,19 L10,10 C10,8.896 10.897,8 12,8 L25,8 C26.103,8 27,8.896 27,10 L27,19 C27,20.102 26.103,21 25,21 Z M20,25 L8,25 C6.897,25 6,24.103 6,23 L6,13 L8,13 L8,23 L20,23 L20,25 Z M12,10 L12,19 L25.001,19 L25,10 L12,10 Z"
                  style={{ fill: "rgb(110, 110, 110)" }}
                ></path>
              </svg>
            </span>
            <span className="icons-side deleteicon" onClick={() => onDelete(index-1)}>
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
                  Icon
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
const Sidebar = ({ isModalOpen, handleToggleModal, addQuestion, questionCards, setQuestionCards }) => {
  // Your Sidebar component code here


  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll the container to the bottom when a new card is added
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [questionCards]);

  const handleDelete = (index) => {
    // Create a new array excluding the card at the specified index
    const updatedQuestionCards = questionCards.filter((_, i) => i !== index);
    // Update the state with the new array without the deleted card
    setQuestionCards(updatedQuestionCards);
  };

  return (
    <>
      <div className="sidebar" ref={containerRef}>
        {/* Always render one default card */}
        <QuestionCard key={0} questionType="MCQ" index={0} isNew={false}  onDelete={handleDelete} />

        {/* Render additional question cards */}
        {questionCards.map((questionType, index) => (
          <QuestionCard key={index + 1} questionType={questionType} index={index + 1}  onDelete={handleDelete} />
        ))}
      </div>
      <div id="buttonContainer">
        <div className="outerbutton">
          <span>
            <button onClick={handleToggleModal} className="add-question-btn">
              <span>Add question </span>
            </button>
          </span>

          <div className="slide">
            <span>
              <button onClick={handleToggleModal} className="slideinside">
                <span>Add slide </span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};


export default Sidebar;
