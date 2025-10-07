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
import useFlickity from "../utils/useFlickity";

const Home = () => {
  const flickityRef = useRef(null);

  // Use the hook with the specific options needed for this page
  useFlickity(flickityRef, { 
    speed: 0.2, 
    draggable: false 
  });

  useEffect(() => {
    let flickityInstance;

    if (flickityRef.current) {
      flickityInstance = new Flickity(flickityRef.current, {
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        draggable: false, // disable manual dragging for smooth loop
        freeScroll: true,
        autoPlay: false, // disable Flickity's autoplay
        imagesLoaded: true,
        cellAlign: "left",
      });

      // Custom continuous scroll using requestAnimationFrame
      let animationFrame;
      const ticker = () => {
        flickityInstance.x =
          (flickityInstance.x - 0.2) % flickityInstance.slideableWidth; // speed control
        flickityInstance.selectedIndex = flickityInstance.dragEndRestingSelect();
        flickityInstance.updateSelectedSlide();
        flickityInstance.settle(flickityInstance.x);
        animationFrame = requestAnimationFrame(ticker);
      };
      ticker();

      return () => {
        cancelAnimationFrame(animationFrame);
        flickityInstance.destroy();
      };
    }
  }, []);

  const handleClearLocalStorage = () => {
    localStorage.removeItem("createdQuizId");
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
                  <Link to="#" className="toolbar__tile">
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

   
        <Headermain />
     

      <main className="main-content-area">
        <QuizListPrivate />
        <QuizListPublic />
      </main>
      <footer className="footermain">Developed by : SARANG .R. THAKRE</footer>
    </>
  );
};

export default Home;
