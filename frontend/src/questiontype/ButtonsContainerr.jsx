import React from "react";
import { IoTriangleSharp } from "react-icons/io5";
import { BsDiamondFill } from "react-icons/bs";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import ButtonCardd from "./ButtonCardd";

const ButtonsContainerr = ({ answers, onAnswerChange, onCorrectAnswerChange }) => {
  // Define the array of icons corresponding to each ButtonCard
  const icons = [
    <IoTriangleSharp fontSize="35px" color="white" />,
    <FaSquareFull fontSize="20px" color="white" />,
    <BsDiamondFill fontSize="35px" color="white" />,
    <FaCircle fontSize="35px" color="white" />
  ];

  return (
    <>
      {icons.map((icon, index) => (
        <ButtonCardd
          key={index}
          index={index} // Pass the index of the ButtonCardd
          icon={icon}
          colorClass={`color${index + 1}`}
          answer={answers[index]}
          onAnswerChange={(updatedAnswer) => onAnswerChange(index, updatedAnswer)}
          onCorrectAnswerChange={onCorrectAnswerChange} // Pass the onCorrectAnswerChange function
        />
      ))}
    </>
  );
};

export default ButtonsContainerr;
