import React, { useState } from "react";
import "./ButtonCard.css";

const ButtonCard = ({ icon, colorClass, answer, onAnswerChange, index, onCorrectAnswerChange, questiontype }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [buttonClass, setButtonClass] = useState(
    "icon-button__IconButton-sc-12q2f5v-0 kCpRMI selected-tick__CheckIcon-sc-1g1pllh-0 bJukWO styles__SelectedTick-sc-1i18fz0-4 hMqSGt"
  );

  const handleTyping = (e) => {
    const updatedAnswer = e.target.value.replace(/\s/g, "\u00a0"); // Replace spaces with non-breaking spaces
    setIsTyping(updatedAnswer.trim().length > 0); // Update isTyping based on the length of the typed value
    onAnswerChange(updatedAnswer); // Call the onAnswerChange function to update the answer
  };

  const handleButtonClick = () => {
    setIsChecked(!isChecked);
    setButtonClass(
      isChecked
        ? "icon-button__IconButton-sc-12q2f5v-0 kCpRMI selected-tick__CheckIcon-sc-1g1pllh-0 bJukWO styles__SelectedTick-sc-1i18fz0-4 hMqSGt"
        : "icon-button__IconButton-sc-12q2f5v-0 kCpRMI buttonc selected-tick__CheckIcon-sc-1g1pllh-0 bJukWO styles__SelectedTick-sc-1i18fz0-4 hMqSGt"
    );
    // Toggle the correctness of the answer at the specified index
    onCorrectAnswerChange(index);
  };

  const handleButtonHover = (isHovered) => {
    setIsButtonHovered(isHovered);
  };

  return (
    <div
      className={
        answer && answer.trim().length > 0 // Check if answer is defined and contains more than 0 characters
          ? ` hkxZCz  ${colorClass} pd dUftrB`
          : isTyping // If no data in answer prop, use isTyping state to determine class
          ? ` hkxZCz  ${colorClass} pd dUftrB`
          : ` eABDCX  backgroundcolorbeforetyping pd kDnVIK`
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
                className={
                  answer &&
                  typeof answer === "string" &&
                  answer.trim().length > 0
                    ? " hUNSrl"
                    : isTyping
                    ? " hUNSrl"
                    : " cNAlhn"
                }
              >
                <textarea
                  className={
                    answer &&
                    typeof answer === "string" &&
                    answer.trim().length > 0
                      ? `hUNSrl ${colorClass}`
                      : isTyping
                      ? `${colorClass} hUNSrl `
                      : " cNAlhn"
                  }
                  id="question-choice-0"
                  spellCheck="true"
                  data-lexical-editor="true"
                  data-editor-value=""
                  data-functional-selector="question-answer__input"
                  style={{
                    userSelect: "text",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    border: "none"
                  }}
                  value={answer} // Set the value of the textarea
                  onChange={handleTyping} // Use onChange event to handle typing
                />
              </div>
            </div>
          </div>
        </span>

        {(!answer || !isTyping) && !questiontype === "Nat" && (
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

        {(isTyping || answer) && questiontype !== "Nat" && (
          <button
            aria-label={`Toggle answer ${index + 1} correct.`}
            aria-checked={isChecked}
            data-functional-selector="question-answer__toggle-button"
            data-onboarding-step=""
            tabIndex="0"
            className={buttonClass}
            onClick={handleButtonClick}
            onMouseEnter={() => handleButtonHover(true)}
            onMouseLeave={() => handleButtonHover(false)}
          >
            {isChecked && (
              <span className="icon-button__IconSpan-sc-12q2f5v-2 ftJDBB">
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

export default ButtonCard;

