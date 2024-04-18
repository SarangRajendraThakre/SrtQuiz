import React, { useRef, useEffect } from "react";
import "./home.css";
import Flickity from "flickity";
import "flickity/css/flickity.css";

const Home = () => {
  const flickityRef = useRef(null);

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

    // Start autoplay timer again after dragging ends
    const handleDragEnd = () => {
      flickityInstance.playPlayer();
    };

    flickityInstance.on("dragEnd", handleDragEnd);

    return () => {
      flickityInstance.off("dragEnd", handleDragEnd);
    };
  }, []);

  return (
    <div className="toolbar_container">
      <div className="toolbar toolbar-active">
        <div className="toolbar__logo">
          <img
            src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/kahoot_tb_logo.webp"
            alt=""
          />
        </div>
        <div className="toolbar__switcher">
          <a
            href=""
            className="toolbar__switcher__item toolbar__switcher__item--active"
          >
            For all
          </a>
          <a href="" className="toolbar__switcher__item ">
            At work
          </a>
          <a href="" className="toolbar__switcher__item ">
            At School
          </a>
          <a href="" className="toolbar__switcher__item ">
            At Home
          </a>
        </div>
        <div className="toolbar__section">
          <div className="slide_container is-draggable flickity-enabled">
            <div className="slide_container_inner">
              <div
                className="carousel slide_container_inner "
                ref={flickityRef}
              >
                {/* Carousel items */}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>{" "}
                <a href="" className="toolbar__tile">
                  <img
                    src="https://static.toiimg.com/thumb/msid-100991155,width-400,resizemode-4/100991155.jpg"
                    alt=""
                  />
                </a>
                {/* Add more carousel items as needed */}
              </div>
            </div>
          </div>
          <div className="toolbar__section__box-shadow--left"></div>
          <div className="toolbar__section__box-shadow--right"></div>
        </div>

        <div className="toolbar__buttons">
          <a href="http://localhost:5173" class="toolbar__buttons__create">
            <img
              src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/create_icon.png"
              alt=""
            />
           
          </a>

          <a href="http://localhost:5173" class="toolbar__buttons__join">
            <img
              src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/enter_pin_logo.png"
              alt=""
            />
           
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
