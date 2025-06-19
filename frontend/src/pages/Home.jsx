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
// Removed unused imports: Header, Header1

const Home = () => {
  const flickityRef = useRef(null);

  // Refs for scrolling to specific sliders (though not directly used in this snippet's rendering, they are kept for potential future use if scroll-to-section functionality is implemented based on these clicks)
  const biologySliderRef = useRef(null);
  const PhysicsSliderRef = useRef(null);
  const GkSliderRef = useRef(null);
  const mathsSliderRef = useRef(null);
  const historySliderRef = useRef(null);

  useEffect(() => {
    let flickityInstance;

    if (flickityRef.current) {
      // Initialize Flickity with improved options for smoother behavior
      flickityInstance = new Flickity(flickityRef.current, {
        autoPlay: 2000, // Slightly increased autoplay for smoother transitions
        pauseAutoPlayOnHover: true, // Allow pausing on hover for better UX
        wrapAround: true,
        prevNextButtons: false,
        pageDots: false,
        draggable: true,
        freeScroll: true, // Allows for free dragging, but can sometimes feel less controlled. You might consider 'false' for more snap.
        cellAlign: "left",
        // Adjusted friction and selectedAttraction for a smoother, less "jerky" feel
        friction: 0.25, // Increased friction for more natural deceleration
        selectedAttraction: 0.02, // Slightly increased attraction for a gentler snap
        dragThreshold: 5, // Minimum drag distance to start dragging
        imagesLoaded: true, // Ensures images are loaded before calculating cell sizes, preventing jerks
      });
    }

    // Restart autoplay after dragging ends
    const handleDragEnd = () => {
      flickityInstance.playPlayer();
    };

    // Flickity emits 'pointerDown' when a drag starts, stopping autoplay.
    // 'pointerUp' is emitted when the drag ends, and 'dragEnd' specifically when the drag gesture is complete.
    // We want to restart autoplay after the user has finished interacting.
    flickityInstance.on("dragEnd", handleDragEnd);

    // Cleanup: Destroy Flickity instance when component unmounts
    return () => {
      if (flickityInstance) {
        flickityInstance.off("dragEnd", handleDragEnd);
        flickityInstance.destroy();
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const handleClearLocalStorage = () => {
    localStorage.removeItem("createdQuizId");
  };

  // Function to scroll to a ref (currently not fully implemented to scroll, but good for structure)
  const scrollToSlider = (ref) => {
    if (ref.current) {
      // Logic to scroll to the ref.
      // For example, ref.current.scrollIntoView({ behavior: 'smooth' });
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
                {/* Refactored Flickity carousel to directly contain images/links */}
                <div className="carousel slide_container_inner" ref={flickityRef}>
                  <Link
                    to="#"
                    className="toolbar__tile"
                    // Removed onClick that references undefined refs here, as they are not used for scrolling the carousel itself
                    // If you intend to scroll to *sections* below based on these clicks, ensure those sections have corresponding refs and the scrollToSlider function is fully implemented.
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

      <main>
        <QuizListPrivate />
        <QuizListPublic />
      </main>
      <footer className="footermain">Developed by : SARANG .R. THAKRE</footer>
    </>
  );
};

export default Home;