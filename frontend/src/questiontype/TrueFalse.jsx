import "./Mcq.css";
import React, { useState } from "react";

import { GoPlus } from "react-icons/go";
import { IoTriangleSharp } from "react-icons/io5";
import { FaCircle, FaSquareFull } from "react-icons/fa";
import { Bs0Square, BsDiamondFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { BiSolidImage } from "react-icons/bi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BsPlusLg } from "react-icons/bs";
import { BiCircle } from "react-icons/bi";
import Button from "../pages/Button";

const TrueFalse = () => {
  return (
    <>
      <div className="questiontext">
        <div className="advertise">
          <div className="advertiseinner"></div>
        </div>

        <div className="questiontextinput">
          <div className="innerquestiontextinput">
            <div className="innerquestiontextinputinner">
              <div className="innerquestiontextinputinnerinner">
                <div
                  className="innerquestiontextinputinnerinnerinner"
                  contentEditable="true"
                >
                  <p placeholder="start typing your question"></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mainmiddlearea">
          <div className="mainmiddleareainner">
            <div className="mainmiddleareainnerinner">
              <div className="mainmiddleareainnerinnerinner">
                <div className="mainmiddleareainnerinnerinnerinner">
                  <div className="mainmiddleareainnerinnerinnerinnerinner">
                    <div className="uploadinnercontent">
                      <div className="uploadimg">
                        <div className="uploadimgurl"></div>
                        <div className="uploadbtn">
                          <div className="uploadbtninner">
                            <span className="spanicon">
                              <BsPlusLg fontSize="25px" />
                            </span>
                          </div>
                        </div>
                        <p className="textofupload">Find and insert media</p>
                      </div>
                      <div className="uploadingmessage">
                        <p
                          className="uploaddrag"
                        >
                          <button className="buttonupload">Upload file</button>{" "}
                          or drag here to upload
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="optionmainarea">
          <div className="optionmainareainner">
            {" "}
            <div className="optionmainareainnerinner">
            <div className="optionmainareainnerinnerinner"> 
            <Button/> 
            </div>
          </div>
        </div>
        </div> </div>
    </>
  );
};

export default TrueFalse;
