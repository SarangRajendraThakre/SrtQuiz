// src/Home.js
import React, { useRef, useEffect } from "react";
import "./home.css";
import Flickity from "flickity";
import "flickity/css/flickity.css";

// Import all images from their respective paths
import Biology from "../assets/Biology-copy.webp";
import Physics from "../assets/Physics.webp";
import geograph from "../assets/geograph.jpg";
import current from "../assets/current.jpg";
import MATHEMATICS from "../assets/MATHEMATICS.png";
import GK from "../assets/GK-general-science.webp";
import history from "../assets/history.jpg";

import enter_pin_logo from "../assets/enter_pin_logo.png";
import create_icon from "../assets/create_icon.png";
import logo from "../assets/SRTLL.png";

import QuizListPrivate from "../components/QuizList/QuizListPrivate";
import QuizListPublic from "../components/QuizList/QuizListPublic";
import { Link } from "react-router-dom";
import Headermain from "../components/Header/Headermain";

const Home = () => {
  const flickityRef = useRef(null);

  const biologySliderRef = useRef(null);
  const PhysicsSliderRef = useRef(null);
  const GkSliderRef = useRef(null);
  const mathsSliderRef = useRef(null);
  const historySliderRef = useRef(null);

  useEffect(() => {
    let flickityInstance;

    if (flickityRef.current) {
      flickityInstance = new Flickity(flickityRef.current, {
        autoPlay: 2000,
        pauseAutoPlayOnHover: true,
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        draggable: true,
        freeScroll: true,
        cellAlign: "left",
        friction: 0.25,
        selectedAttraction: 0.02,
        dragThreshold: 5,
        imagesLoaded: true,
      });
    }

    const handleDragEnd = () => {
      flickityInstance.playPlayer();
    };

    flickityInstance.on("dragEnd", handleDragEnd);

    return () => {
      if (flickityInstance) {
        flickityInstance.off("dragEnd", handleDragEnd);
        flickityInstance.destroy();
      }
    };
  }, []);

  const handleClearLocalStorage = () => {
    localStorage.removeItem("createdQuizId");
  };

  const scrollToSlider = (ref) => {
    if (ref.current) {
      console.log(`Attempting to scroll to: ${ref.current.id || 'an element'}`);
    }
  };

  return (
    <>
      <div className="toolbar_container">
        <div className="toolbar toolbar-active toolbarc1">
          <div className="toolbar__logo">
            <Link to="/">
              <img src={logo} alt="SRTLL Logo" />
            </Link>
          </div>
          <div className="toolbar__switcher">
            <Link
              to="/"
              className="toolbar__switcher__item toolbar__switcher__item--active"
            >
              For all
            </Link>
            <Link to="/edu" className="toolbar__switcher__item ">
              Knowledge
            </Link>
            <Link to="/fun" className="toolbar__switcher__item ">
              Fun
            </Link>
            <Link to="/motivation" className="toolbar__switcher__item ">
              Motivation
            </Link>
          </div>
          <div className="toolbar__section">
            <div className="slide_container is-draggable flickity-enabled">
              <div className="slide_container_inner">
                <div className="carousel slide_container_inner" ref={flickityRef}>
                  <Link
                    to="#"
                    className="toolbar__tile"
                  >
                    <img src={Biology} alt="Biology" />
                  </Link>
                  <Link to="#" className="toolbar__tile">
                    <img src={Physics} alt="Physics" />
                  </Link>
                  <Link to="#" className="toolbar__tile">
                    <img src={GK} alt="GK" />
                  </Link>
                  <Link to="#" className="toolbar__tile">
                    <img src={MATHEMATICS} alt="MATHEMATICS" />
                  </Link>
                  <Link to="#" className="toolbar__tile">
                    <img src={current} alt="Current Affairs" />
                  </Link>
                  <Link to="#" className="toolbar__tile">
                    <img src={geograph} alt="Geography" />
                  </Link>
                  <Link to="#" className="toolbar__tile">
                    <img src={history} alt="History" />
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
              className="toolbar__buttons__create custom-button"
              onClick={handleClearLocalStorage}
            >
              <img src={create_icon} alt="Create Quiz" />
            </Link>

            <Link to="/join" className="toolbar__buttons__join custom-button">
              <img src={enter_pin_logo} alt="Enter Pin" />
            </Link>
          </div>
        </div>
      </div>

    <div className="secondary-header-wrapper">
        <Headermain/>
      </div>



      {/* ADD THIS CLASS HERE */}
      <main className="main-content-area">
        <QuizListPrivate />
        <QuizListPublic />
      </main>
      <footer className="footermain">Developed by : SARANG .R. THAKRE</footer>
    </>
  );
};

export default Home;