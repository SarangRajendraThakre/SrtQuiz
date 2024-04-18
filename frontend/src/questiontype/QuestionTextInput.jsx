// QuestionTextInput.js

import React from "react";

const QuestionTextInput = ({ value, onChange }) => {
  return (
    <div className="questiontextinput">
      <div className="innerquestiontextinput">
        <div className="innerquestiontextinputinner">
          <div className="innerquestiontextinputinnerinner">
            <div className="innerquestiontextinputinnerinnerinner">
              <input
                className="inputquestion"
                type="text"
                placeholder="Type question here"
                value={value}
                onChange={onChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionTextInput;
