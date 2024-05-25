import React from 'react'
import "./home.css"

const Foroffice = () => {
  return (
    <> <div className="toolbar_container">
    <div className="toolbar toolbar-active">
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
        <Link to="/atwork" className="toolbar__switcher__item toolbar__switcher__item--active ">
          At work
        </Link>
        <Link to="/atschool" className="toolbar__switcher__item ">
          At School
        </Link>
        <Link to="/athome" className="toolbar__switcher__item ">
          At Home
        </Link>
      </div>
      <div className="toolbar__section">
        <div className="slide_container is-draggable flickity-enabled">
          <div className="slide_container_inner">
            <div
              className="carousel slide_container_inner "
              ref={flickityRef}
            >
              {/* Carousel items */}
             
              <Link to="/" className="toolbar__tile">
                <img src={img8} alt="" />
              </Link>
              {/* Add more carousel items as needed */}
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
            src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/create_icon.png"
            alt=""
          />
        </Link>

        <Link to="/takequiz" className="toolbar__buttons__join">
          <img
            src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/enter_pin_logo.png"
            alt=""
          />
        </Link>
      </div>
    </div>
  </div>
</>
  )
}

export default Foroffice