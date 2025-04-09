import React from "react";
import "./Button_1.css";

const Button_1 = ({ children, className, onClick }) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button_1;
