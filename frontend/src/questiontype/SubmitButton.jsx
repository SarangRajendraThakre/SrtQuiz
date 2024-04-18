// SubmitButton.js

import React from "react";

const SubmitButton = ({ onClick }) => {
  return (
    <button onClick={onClick} className="submit-button">
      Submit
    </button>
  );
};

export default SubmitButton;
