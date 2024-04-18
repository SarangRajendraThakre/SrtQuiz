import React from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { BsDiamondFill } from "react-icons/bs";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import "./OptionCard.css";

const OptionCard = ({ index, value, onInput, onSelectCorrectAnswer }) => {
  // Define an array of icon components corresponding to each index
  const icons = [
    <IoTriangleSharp fontSize="35px" color="white" />,
    <BsDiamondFill fontSize="35px" color="white" />,
    <FaCircle fontSize="35px" color="white" />,
    <FaSquareFull fontSize="20px" color="white" />, // Add more icons as needed
  ];

  return (
    <div className="optioncardselectedtyping">
      {/* Render the option card */}
      <div className={`optioncardinner color${index + 1}`}>
        {/* Render the icon based on the index */}
        <span className="optioncardinnerspan">{icons[index]}</span>
      </div>
      <div className="optioncardinnermain">
        <span className="ocim">
          <div className="ocimh">
            <div className="ocimhh">
              <div
                className="answertexthere"
                contentEditable="true"
                type="text"
                placeholder={`Add answer ${index + 1}`}
                value={value}
                onInput={onInput}
              ></div>
            </div>
          </div>
        </span>
      

<button  className="imgupbtn"> <span ><svg viewBox="0 0 32 32" focusable="false" stroke="none" strokeWidth="0" aria-labelledby="label-a0dc3a98-e20c-4785-ae73-d9a03521e78b" aria-hidden="true"  className="icon__Svg-sc-xvsbpg-1 ipIYNE">
          <title id="label-a0dc3a98-e20c-4785-ae73-d9a03521e78b">Icon</title>
          <path d="M25,6 C26.104,6 27,6.897 27,8 L27,8 L27,24 C27,25.103 26.104,26 25,26 L25,26 L7,26 C5.897,26 5,25.103 5,24 L5,24 L5,8 C5,6.897 5.897,6 7,6 L7,6 Z M25,8 L7,8 L7,24 L24.997,24 L24.999,14 L25,14 L25,8 Z M18,14 L22,20 L10,20 L13,16 L15,18 L18,14 Z M12,11 C13.104,11 14,11.894 14,13 C14,14.105 13.104,15 12,15 C10.895,15 10,14.105 10,13 C10,11.894 10.895,11 12,11 Z" style={{ fill: "rgb(110, 110, 110)" }}></path>
        </svg></span>
        </button>

        <button id="" aria-label="Toggle answer 1 correct." aria-checked="false" role="switch" data-functional-selector="question-answer__toggle-button" data-onboarding-step="" tabindex="0" className="togglebtnforrightanswer"><span className="togglebtnforrightanswerinner">
          
          <img src="https://assets-cdn.kahoot.it/builder/v2/assets/check-icon-fe2a6a3d.svg" alt="" className="togglebtnforrightanswerinnerimg" /></span></button>


       
      </div>
    </div>
  );
};

export default OptionCard;
