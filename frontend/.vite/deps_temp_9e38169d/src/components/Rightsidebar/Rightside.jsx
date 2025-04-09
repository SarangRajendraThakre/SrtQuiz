import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import "./rightside.css";
import bg12 from '../../assets/nature/bg12.jpg';
import backgrounstyle2 from '../../assets/nature/backgrounstyle2.jpg';
import nature23 from '../../assets/nature/nature23.jpg';
import tech12 from '../../assets/nature/tech12.jpg';
import techno234 from '../../assets/nature/techno234.webp';
import tech532 from '../../assets/nature/tech532.jpg';

import { useQuiz } from "../../context/QuizContext";

const Rightside = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isRightsideVisible, toggleRightsideVisibility, selectedImage, selectImage } = useQuiz(); // Using the useQuiz hook from QuizContext

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const hideRsbm = () => {
    toggleRightsideVisibility();
  };

  const handleImageClick = (image) => {
    selectImage(image); // Set the selected image using the context function
  };

  return (
    <div className={`rightsiderbar ${isSidebarOpen ? "" : "close"}`}>
      <button
        className="btnright"
        onClick={toggleSidebar}
        aria-expanded={isSidebarOpen ? "true" : "false"}
      >
        <span className="faarrow">
          {isSidebarOpen ? (
            <MdOutlineKeyboardArrowRight />
          ) : (
            <MdKeyboardArrowLeft />
          )}
        </span>
      </button>
      <div className="rightsidebarmain">
        {isRightsideVisible && (
          <div className="rsbm">
            <button className="cross-button" onClick={hideRsbm}>
              <RxCross1 />
            </button>
            <div className="themes-section">
              <h3>Themes</h3>
              <div className="themes-category">
              
                <div className="themes-list">
                  <div
                    className={`theme-item ${selectedImage === bg12 ? "selected" : ""}`} // Apply "selected" class if img1 is selected
                    onClick={() => handleImageClick(bg12)}
                  >
                    <img src={bg12} alt="Untitled theme" />
                    <p>bg image 1</p>
                  </div>
                  <div
                    className={`theme-item ${selectedImage === backgrounstyle2 ? "selected" : ""}`} // Apply "selected" class if skyscrapers is selected
                    onClick={() => handleImageClick(backgrounstyle2)}
                  >
                    <img src={backgrounstyle2} alt="Skyscrapers" />
                    <p>Simple</p>
                  </div>
                  <div
                    className={`theme-item ${selectedImage === nature23 ? "selected" : ""}`} // Apply "selected" class if img1 is selected
                    onClick={() => handleImageClick(nature23)}
                  >
                    <img src={nature23} alt="Untitled theme" />
                    <p>Nature 1</p>
                  </div>
                  <div
                    className={`theme-item ${selectedImage === tech12 ? "selected" : ""}`} // Apply "selected" class if img1 is selected
                    onClick={() => handleImageClick(tech12)}
                  >
                    <img src={tech12} alt="Untitled theme" />
                    <p>Technology</p>
                  </div>
                  <div
                    className={`theme-item ${selectedImage === techno234 ? "selected" : ""}`} // Apply "selected" class if img1 is selected
                    onClick={() => handleImageClick(techno234)}
                  >
                    <img src={techno234} alt="Untitled theme" />
                    <p>Technology 1</p>
                  </div>
                  <div
                    className={`theme-item ${selectedImage === tech532 ? "selected" : ""}`} // Apply "selected" class if img1 is selected
                    onClick={() => handleImageClick(tech532)}
                  >
                    <img src={tech532} alt="Untitled theme" />
                    <p>Technology 2</p>
                  </div>
                  {/* Add onClick handlers for other images */}
                </div>
              </div>
              {/* Other code remains unchanged */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rightside;
