import React from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { BsDiamondFill } from "react-icons/bs";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import ButtonCard from "./ButtonCard";

const ButtonsContainerr = ({ answers, onAnswerChange, onCorrectAnswerChange, correctAnswerIndices, questiontype }) => {
  let icons = [];
  let colorClass;

  // Define the array of icons based on question type
  if (questiontype === "True/False") {
    icons = [
      <FaSquareFull fontSize="20px" color="white" />,
      <FaSquareFull fontSize="20px" color="white" />
    ];
  } else if (questiontype === "Nat") {
    icons = [
      <FaSquareFull fontSize="20px" color="white" />
    ];
    // Set colorClass to 4 for Numerical questions
    colorClass = "color4";
  } else {
    icons = [
      <IoTriangleSharp fontSize="35px" color="white" />,
      <FaSquareFull fontSize="20px" color="white" />,
      <BsDiamondFill fontSize="35px" color="white" />,
      <FaCircle fontSize="35px" color="white" />
    ];
  }

  return (
    <>
      {icons.map((icon, index) => (
        <ButtonCard
          key={index}
          index={index}
          icon={icon}
          colorClass={questiontype === "Nat" ? colorClass : `color${index + 1}`}
          answer={answers[index]}
          onAnswerChange={(updatedAnswer) => onAnswerChange(index, updatedAnswer)}
          onCorrectAnswerChange={onCorrectAnswerChange}
          correctAnswerIndices={correctAnswerIndices} // Pass the correctAnswerIndices to ButtonCard component
          questiontype={questiontype}
        />
      ))}
    </>
  );
};

export default ButtonsContainerr;
