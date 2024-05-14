import React from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { BsDiamondFill } from "react-icons/bs";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import ButtonCard from "./ButtonCard";

const ButtonsContainerr = ({ answers, onAnswerChange, onCorrectAnswerChange, questiontype }) => {
  // Define the array of icons based on question type
  const icons = questiontype === "True/False" ? 
    [
      <FaSquareFull fontSize="20px" color="white" />,
      <FaSquareFull fontSize="20px" color="white" />
    ]
  :
    [
      <IoTriangleSharp fontSize="35px" color="white" />,
      <FaSquareFull fontSize="20px" color="white" />,
      <BsDiamondFill fontSize="35px" color="white" />,
      <FaCircle fontSize="35px" color="white" />
    ];

  return (
    <>
      {icons.map((icon, index) => (
        <ButtonCard
          key={index}
          index={index}
          icon={icon}
          colorClass={`color${index + 1}`}
          answer={answers[index]}
          onAnswerChange={(updatedAnswer) => onAnswerChange(index, updatedAnswer)}
          onCorrectAnswerChange={onCorrectAnswerChange}
          questiontype={questiontype} // Pass the questiontype to ButtonCard component
        />
      ))}
    </>
  );
};

export default ButtonsContainerr;
