import React, { useState } from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { BsDiamondFill } from "react-icons/bs";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import "./OptionCard.css";

const OptionCard = ({ index, value, onInput, onSelectCorrectAnswer }) => {
  const [isTyping, setIsTyping] = useState(false);

  const handleInput = (e) => {
    const text = e.target.textContent.trim();
    setIsTyping(text.length > 0); // Set isTyping to true if there is text
    onInput(e); // Call the parent component's onInput function
  };

  const icons = [
    <IoTriangleSharp fontSize="35px" color="white" />,
    <BsDiamondFill fontSize="35px" color="white" />,
    <FaCircle fontSize="35px" color="white" />,
    <FaSquareFull fontSize="20px" color="white" />,
  ];

  const [isButtonVisible, setIsButtonVisible] = useState(true); // State to manage button visibility

  const handleInputClick = () => {
    setIsButtonVisible(false); // Hide the image button when the content editable div is clicked
  };

  

  return (
    <div className="card__Card-sc-1bp5dip-0 eABDCX styles__StyledCard-sc-1i18fz0-9 kDnVIK">
      <div className="styles__IconWrapper-sc-1sl6w0-0 dVBqmP">
        <span className="icon__Icon-sc-xvsbpg-0 ejCBnJ card-icon__icon">
          <svg viewBox="0 0 32 32" focusable="false" stroke="rgba(0, 0, 0, 0.15)" strokeWidth="1.3px" aria-labelledby="label-4a4ca27c-f4ee-4ed1-a3de-c9cc1a8956cc" aria-hidden="true" className="icon__Svg-sc-xvsbpg-1 ipIYNE">
            <title id="label-4a4ca27c-f4ee-4ed1-a3de-c9cc1a8956cc">Icon</title>
            <path d="M27,24.559972 L5,24.559972 L16,7 L27,24.559972 Z" fill="inherit"></path>
          </svg>
        </span>
      </div>
      <div className="styles__CardContentWrapper-sc-1i18fz0-8 jLQhNw">
        <span className="styles__TooltipContent-sc-1i18fz0-1 jXKFXn">
          <div
            aria-label="Add answer 1"
            className="styles__Container-sc-1nn2em3-0 hJlEGR"
            onClick={handleInputClick} // Handle click event on the content editable div
          >
            <div className="styles__Wrapper-sc-x56dkc-0 jsnnYH">
              <div
                aria-label="Add answer 1"
                className="styles__ContentEditable-sc-x56dkc-1 dwhAps"
                contentEditable="true"
                id="question-choice-0"
                role="textbox"
                spellCheck="true"
                data-lexical-editor="true"
                data-editor-value=""
                data-functional-selector="question-answer__input"
              />
            </div>
          </div>
        </span>
        {isButtonVisible && (
          <div className="add-image-as-answer-button__AddMediaButtonWrapper-sc-1utqm9v-0 hFycfb">
            <button aria-label="Image library" data-functional-selector="add-image-as-answer-0" tabIndex="0" className="icon-button__IconButton-sc-12q2f5v-0 dsNiMf">
              <span className="icon__Icon-sc-xvsbpg-0 ejCBnJ" data-functional-selector="icon">
                <svg viewBox="0 0 32 32" focusable="false" stroke="none" strokeWidth="0" aria-labelledby="label-3312d7c4-ab08-4410-8f5a-34fa1c45e30f" aria-hidden="true" className="icon__Svg-sc-xvsbpg-1 ipIYNE">
                  <title id="label-3312d7c4-ab08-4410-8f5a-34fa1c45e30f">Icon</title>
                  <path
                    d="M25,6 C26.104,6 27,6.897 27,8 L27,8 L27,24 C27,25.103 26.104,26 25,26 L25,26 L7,26 C5.897,26 5,25.103 5,24 L5,24 L5,8 C5,6.897 5.897,6 7,6 L7,6 Z M25,8 L7,8 L7,24 L24.997,24 L24.999,14 L25,14 L25,8 Z M18,14 L22,20 L10,20 L13,16 L15,18 L18,14 Z M12,11 C13.104,11 14,11.894 14,13 C14,14.105 13.104,15 12,15 C10.895,15 10,14.105 10,13 C10,11.894 10.895,11 12,11 Z"
                    style={{ fill: 'rgb(110, 110, 110)' }}
                  />
                </svg>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OptionCard;
