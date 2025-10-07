import React, { useRef, useEffect } from "react";
import "./home.css";
import Flickity from "flickity";
import "flickity/css/flickity.css";
import keepgoing from "../assets/keepgoing.jpg";
import keepgoing1 from "../assets/keepgoing1.jpg";
import img2 from "../assets/English-Vocabulary-Exercises.jpg";
import img3 from "../assets/Nature-960x640.jpg";
import img4 from "../assets/Top-IT-Skills-2030.png";
import img5 from "../assets/13_5383.jpg";
import img6 from "../assets/current.jpg";
import img7 from "../assets/Nature-960x640.jpg";
import enter_pin_logo from "../assets/enter_pin_logo.png";
import create_icon from "../assets/create_icon.png";
import img8 from "../assets/geograph.jpg";
import img9 from "../assets/movielistquiz.jpg";
import img10 from "../assets/Maths-Camp-copy-1030x324.png";
import logo from "../assets/SRTLL.png";
import QuizListPrivate from "../components/QuizList/QuizListPrivate";
import QuizListPublic from "../components/QuizList/QuizListPublic";
import { Link } from "react-router-dom";
import Forall from "./ForFun";
import ComputerSlider from "../components/QuizList/ComputerSlider";
import useFlickity from "../utils/useFlickity";
import Headermain from "../components/Header/Headermain";


const Formotivation = () => {
  const flickityRef = useRef(null);
  const ComputerSliderRef = useRef(null);

    useFlickity(flickityRef, { speed: 0.2 });

  const handleClearLocalStorage = () => {
    localStorage.removeItem("createdQuizId");
  };

  return (
    <> <div className="toolbar_container">
    <div className="toolbar toolbar-active toolbarc4">
      <div className="toolbar__logo">
      <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
          <div className="toolbar__switcher">
            <Link
              to="/"
              className="toolbar__switcher__item "
            >
              For all
            </Link>
            <Link to="/edu" className="toolbar__switcher__item ">
              Knowledge
            </Link>
            <Link to="/fun" className="toolbar__switcher__item ">
              Fun
            </Link>
            <Link to="/motivation" className="toolbar__switcher__item toolbar__switcher__item--active ">
             Motivation
            </Link>
      </div>
      <div className="toolbar__section">
        <div className="slide_container is-draggable flickity-enabled">
          <div className="slide_container_inner">
            <div
              className="carousel slide_container_inner "
              ref={flickityRef}
            >
              
          
              <Link to="/" className="toolbar__tile">
                <img src={keepgoing1} alt="" />
              </Link>
             
            </div>
          </div>
        </div>
        <div className="toolbar__section__box-shadow--left"></div>
        <div className="toolbar__section__box-shadow--right"></div>
      </div>



      <div className="toolbar__buttons">
        <Link
          to="/createquiz"
          className="toolbar__buttons__create"
          onClick={handleClearLocalStorage}
        >
          <img
            src={create_icon}
            alt=""
          />
        </Link>

        <Link to="/takequiz" className="toolbar__buttons__join">
          <img
          src={enter_pin_logo}
            alt=""
          />
        </Link>
      </div>
    </div>
  </div>

     <Headermain/>
  <main>
  <div ref={ComputerSliderRef} className="first-slider-margin">
                    <ComputerSlider />
                </div>
  </main>
  <footer className="footermain">Developed by : SARANG .R. THAKRE</footer>
  
</>
  )
}

export default Formotivation;