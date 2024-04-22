import React, { useState } from "react";
import "../pages/Button.css";

import { IoTriangleSharp } from "react-icons/io5";
import { BsDiamondFill } from "react-icons/bs";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import ButtonCardd from "./ButtonCardd";


const ButtonsContainerr = ({ answers, onAnswerChange  }) => {
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
          icon={icon}
          colorClass={`color${index + 1}`}
          answer={answers[index]}
         
          onAnswerChange={(updatedAnswer) => onAnswerChange(index, updatedAnswer)}
          // Pass the onAnswerChange function to ButtonCardd
        />
      ))}
    </>
  );
};

export default ButtonsContainerr;