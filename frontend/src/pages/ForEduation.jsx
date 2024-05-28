import React, { useRef, useEffect } from "react";
import "./home.css";
import Flickity from "flickity";
import "flickity/css/flickity.css";
import Biology from "../assets/Biology-copy.webp";
import Physics from "../assets/Physics.webp";
import geograph from "../assets/geograph.jpg";
import current from "../assets/current.jpg";
import MATHEMATICS from "../assets/MATHEMATICS.png";
import GK from "../assets/GK-general-science.webp";
import history from "../assets/history.jpg";
import img9 from "../assets/movielistquiz.jpg";
import img10 from "../assets/Maths-Camp-copy-1030x324.png";
import logo from "../assets/SRTLL.png";
import { Link } from "react-router-dom";
import BiologySlider from "../components/QuizList/BiologySlider";
import GeographySlider from "../components/QuizList/GeographySlider";
import MathsSlider from "../components/QuizList/MathsSlider";
import HistorySlider from "../components/QuizList/HistorySlider";
import PhysicsSlider from "../components/QuizList/PhysicsSlider";
import GkSlider from "../components/QuizList/GkSlider";

const ForEducation = () => {
  const flickityRef = useRef(null);
  const biologySliderRef = useRef(null);
  const geographySliderRef = useRef(null);
  const mathsSliderRef = useRef(null);
  const historySliderRef = useRef(null);
  const PhysicsSliderRef = useRef(null);
  const GkSliderRef = useRef(null);
  useEffect(() => {
    let flickityInstance;

    if (flickityRef.current) {
      flickityInstance = new Flickity(flickityRef.current, {
        autoPlay: 1500,
        pauseAutoPlayOnHover: false,
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        draggable: true,
        freeScroll: true,
        cellAlign: "left",
        friction: 0.2,
        selectedAttraction: 0.01,
        dragThreshold: 0,
      });
    }

    const handleDragEnd = () => {
      flickityInstance.playPlayer();
    };

    flickityInstance.on("dragEnd", handleDragEnd);

    return () => {
      flickityInstance.off("dragEnd", handleDragEnd);
    };
  }, []);

  const handleClearLocalStorage = () => {
    localStorage.removeItem("createdQuizId");
  };

  const scrollToSlider = (sliderRef) => {
    if (sliderRef.current) {
      sliderRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="toolbar_container">
        <div className="toolbar toolbar-active toolbarc2">
          <div className="toolbar__logo">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
          <div className="toolbar__switcher">
            <Link to="/" className="toolbar__switcher__item">
              For all
            </Link>
            <Link to="/edu" className="toolbar__switcher__item toolbar__switcher__item--active">
              Knowledge
            </Link>
            <Link to="/fun" className="toolbar__switcher__item">
              Fun
            </Link>
            <Link to="/motivation" className="toolbar__switcher__item">
              Motivation
            </Link>
          </div>
          <div className="toolbar__section">
            <div className="slide_container is-draggable flickity-enabled">
              <div className="slide_container_inner">
                <div className="carousel slide_container_inner" ref={flickityRef}>
                  {/* Carousel items */}
                  <Link to="#" className="toolbar__tile" onClick={() => scrollToSlider(biologySliderRef)}>
                    <img src={Biology} alt="Biology" />
                  </Link>
                  <Link to="#" className="toolbar__tile" onClick={() => scrollToSlider(PhysicsSliderRef)}>
                    <img src={Physics} alt="Physics" />
                  </Link>
                  <Link to="#" className="toolbar__tile" onClick={() => scrollToSlider(GkSliderRef)}>
                    <img src={GK} alt="GK" />
                  </Link>
                
                  <Link to="#" className="toolbar__tile" onClick={() => scrollToSlider(mathsSliderRef)}>
                    <img src={MATHEMATICS} alt="MATHEMATICS" />
                  </Link>
                  <Link to="#" className="toolbar__tile" onClick={() => scrollToSlider(biologySliderRef)}>
                    <img src={current} alt="current" />
                  </Link>
                  <Link to="#" className="toolbar__tile" onClick={() => scrollToSlider(biologySliderRef)}>
                    <img src={geograph} alt="geograph" />
                  </Link>
                  <Link to="#" className="toolbar__tile" onClick={() => scrollToSlider(historySliderRef)}>
                    <img src={history} alt="History" />
                  </Link>
                  {/* Add more carousel items as needed */}
                </div>
              </div>
            </div>
            <div className="toolbar__section__box-shadow--left"></div>
            <div className="toolbar__section__box-shadow--right"></div>
          </div>

          <div className="toolbar__buttons">
            <Link to="/createquiz" className="toolbar__buttons__create" onClick={handleClearLocalStorage}>
              <img src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/create_icon.png" alt="Create Quiz" />
            </Link>
            <Link to="/takequiz" className="toolbar__buttons__join">
              <img src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/enter_pin_logo.png" alt="Take Quiz" />
            </Link>
          </div>
        </div>
      </div>

      <main>
        <div ref={biologySliderRef}>
          <BiologySlider />
        </div>
        <div ref={geographySliderRef}>
          <GeographySlider />
        </div>
        <div ref={mathsSliderRef}>
          <MathsSlider />
        </div>
        <div ref={historySliderRef}>
          <HistorySlider />
        </div>
        <div ref={PhysicsSliderRef}>
          <PhysicsSlider />
        </div>
        <div ref={GkSliderRef}>
          <GkSlider />
        </div>
      </main>
      <footer className="footermain">Developed by : SARANG .R. THAKRE</footer>
    </>
  );
};

export default ForEducation;
