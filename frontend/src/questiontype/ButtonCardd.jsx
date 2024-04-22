import React, { useState } from "react";
import "../pages/Button.css";

const ButtonCardd = ({ icon, colorClass, answer, onAnswerChange })=> {
  const [isTyping, setIsTyping] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isSpanVisible, setIsSpanVisible] = useState(false);
  const [buttonClass, setButtonClass] = useState(
    "icon-button__IconButton-sc-12q2f5v-0 kCpRMI selected-tick__CheckIcon-sc-1g1pllh-0 bJukWO styles__SelectedTick-sc-1i18fz0-4 hMqSGt"
  );

  
  console.log(answer);
  
  const handleTyping = (e) => {
    const updatedAnswer = e.target.innerText.trim(); // Get the updated answer
    setIsTyping(updatedAnswer.length > 0);
    // Call the function passed via props to update the answer in the parent component
    onAnswerChange(updatedAnswer);
  };

  const handleButtonClick = () => {
    setIsChecked(!isChecked);
    setButtonClass(
      isChecked
        ? "icon-button__IconButton-sc-12q2f5v-0 kCpRMI selected-tick__CheckIcon-sc-1g1pllh-0 bJukWO  styles__SelectedTick-sc-1i18fz0-4 hMqSGt"
        : "icon-button__IconButton-sc-12q2f5v-0 kCpRMI buttonc selected-tick__CheckIcon-sc-1g1pllh-0 bJukWO styles__SelectedTick-sc-1i18fz0-4 hMqSGt"
    );
  };

  const handleButtonHover = (isHovered) => {
    if (!isChecked) {
      setIsButtonHovered(isHovered);
      setIsSpanVisible(isHovered);
    }
  };

  const handleSpanClick = () => {
    setIsSpanVisible(false);
  };

  return (
    <div
    className={
      (answer && answer.trim().length > 0) // Check if answer is defined and contains more than 0 characters
        ? `card__Card-sc-1bp5dip-0 hkxZCz styles__StyledCard-sc-1i18fz0-9 ${colorClass} pd dUftrB`
        : isTyping // If no data in answer prop, use isTyping state to determine class
          ? `card__Card-sc-1bp5dip-0 hkxZCz styles__StyledCard-sc-1i18fz0-9 ${colorClass} pd dUftrB`
          : `card__Card-sc-1bp5dip-0 eABDCX styles__StyledCard-sc-1i18fz0-9 backgroundcolorbeforetyping pd kDnVIK`
    }
    
    
    >
      <div className={`optioncardinner ${colorClass} `}>
        <span className="optioncardinnerspan">{icon}</span>
      </div>
      <div className="styles__CardContentWrapper-sc-1i18fz0-8 jLQhNw">
        <span className="styles__TooltipContent-sc-1i18fz0-1 jXKFXn">
          <div className="styles__Container-sc-1nn2em3-0 hJlEGR">
            <div className="styles__Wrapper-sc-x56dkc-0 jsnnYH">
              <div
                aria-label="Add answer 1"
                className={
                  (answer && typeof answer === 'string' && answer.trim().length > 0) // Check if answer is defined, a string, and contains more than 0 characters
                    ? 'styles__ContentEditable-sc-x56dkc-1 hUNSrl'
                    : isTyping // If no data in answer prop, use isTyping state to determine class
                      ? 'styles__ContentEditable-sc-x56dkc-1 hUNSrl'
                      : 'styles__ContentEditable-sc-x56dkc-1 cNAlhn'
                }
                

              
                contentEditable="true"
                id="question-choice-0"
                role="textbox"
                spellCheck="true"
                data-lexical-editor="true"
                data-editor-value=""
                data-functional-selector="question-answer__input"
                style={{
                  userSelect: "text",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
                onInput={handleTyping}
              >
                <p dir="ltr">
                  <span data-lexical-text="true">{answer}</span>
                </p>
              </div>
            </div>
          </div>
        </span>

        { !answer && !isTyping && (
          <div className="add-image-as-answer-button__AddMediaButtonWrapper-sc-1utqm9v-0 hFycfb">
            <button
              aria-label="Image library"
              data-functional-selector="add-image-as-answer-0"
              tabIndex="0"
              className="icon-button__IconButton-sc-12q2f5v-0 dsNiMf"
            >
              <span className="icon__Icon-sc-xvsbpg-0 ejCBnJ">
                <svg
                  viewBox="0 0 32 32"
                  focusable="false"
                  stroke="none"
                  strokeWidth="0"
                  aria-labelledby="label-fe73362d-4a25-4af6-9d71-bb2b1bcc78cb"
                  aria-hidden="true"
                  className="icon__Svg-sc-xvsbpg-1 ipIYNE"
                >
                  <title id="label-fe73362d-4a25-4af6-9d71-bb2b1bcc78cb">Icon</title>
                  <path
                    d="M25,6 C26.104,6 27,6.897 27,8 L27,8 L27,24 C27,25.103 26.104,26 25,26 L25,26 L7,26 C5.897,26 5,25.103 5,24 L5,24 L5,8 C5,6.897 5.897,6 7,6 L7,6 Z M25,8 L7,8 L7,24 L24.997,24 L24.999,14 L25,14 L25,8 Z M18,14 L22,20 L10,20 L13,16 L15,18 L18,14 Z M12,11 C13.104,11 14,11.894 14,13 C14,14.105 13.104,15 12,15 C10.895,15 10,14.105 10,13 C10,11.894 10.895,11 12,11 Z"
                    fill="rgb(110, 110, 110)"
                  />
                </svg>
              </span>
            </button>
          </div>
        )}

{( (isTyping || answer)) && (
  <button
    aria-label="Toggle answer 1 correct."
    aria-checked={isChecked}
    role="switch"
    data-functional-selector="question-answer__toggle-button"
    data-onboarding-step=""
    tabIndex="0"
    className={buttonClass}
    onClick={handleButtonClick}
    onMouseEnter={() => handleButtonHover(true)}
    onMouseLeave={() => handleButtonHover(false)}
  >
    {isChecked && isButtonHovered && (
      <span
        tabIndex="-1"
        className="icon-button__IconSpan-sc-12q2f5v-2 ftJDBB"
        onClick={handleSpanClick}
      >
        <img
          src="//assets-cdn.kahoot.it/builder/v2/assets/check-icon-fe2a6a3d.svg"
          alt="checkmark"
          className="icon-button__CheckIcon-sc-12q2f5v-3 bCsMwL"
        />
      </span>
    )}
  </button>
)}


      </div>
    </div>
  );
};

export default ButtonCardd;
