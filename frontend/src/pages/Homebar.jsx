import React from 'react';
import "./homebar.css"

const Homebar = () => {
  return (
    <>
      <div className="toolbar" aria-hidden="true" data-amplitude-link-position="toolbar" style={{ backgroundColor: '#0a4602' }}>
        <div className="toolbar__logo">
          <img src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/kahoot_tb_logo.webp" alt="Kahoot! toolbar, free 10min sessions" />
        </div>
        <div className="toolbar__switcher">
          <a href="javascript:void(0)" aria-controls="toolbar-0" className="toolbar__switcher__item" data-target="0">For all</a>
          <a href="javascript:void(0)" aria-controls="toolbar-1" className="toolbar__switcher__item" data-target="1">At work</a>
          <a href="javascript:void(0)" aria-controls="toolbar-2" className="toolbar__switcher__item" data-target="2">At school</a>
          <a href="javascript:void(0)" aria-controls="toolbar-3" className="toolbar__switcher__item toolbar__switcher__item--active" data-target="3">At home</a>
        </div>
        <div className="toolbar__section">
          <div className="slide-container is-draggable flickity-enabled" data-animation-scale="true" data-animation-increment="0.3" data-animation-hover="0.1" data-direction="rtl" tabIndex="0">
            <div className="flickity-viewport" style={{ height: '85px', touchAction: 'pan-y' }}>
              <div className="flickity-slider" style={{ left: '0px', transform: 'translateX(-47.05%)' }}>
                <a href="https://play.kahoot.it/v2/?quizId=2314940c-05c3-4af5-a650-3eee23dd6b90&amp;gameMode=highestTowers&amp;autoStartGame=true" className="toolbar__tile slide" target="_blank" style={{ position: 'absolute', left: '0%' }} aria-hidden="true" tabIndex="-1">
                  <img src="https://kahoot.com/files/2023/10/Quicklaunch-flags-quiz.png" alt="Flags quiz tallest tower mode" aria-hidden="true" />
                  <span className="toolbar__tile__hover-label" aria-hidden="true">Start now</span>
                </a>
                {/* Other quiz tiles */}
              </div>
            </div>
          </div>
          <div className="toolbar__section__box-shadow--left"></div>
          <div className="toolbar__section__box-shadow--right"></div>
        </div>
        <div className="toolbar__buttons">
          <a href="https://create.kahoot.it/creator" className="toolbar__buttons__create">
            <img src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/create_icon.png" alt="Plus icon" />
            Create a kahoot!
          </a>
          <a href="https://kahoot.it/" className="toolbar__buttons__join">
            <img src="https://kahoot.com/wp-content/themes/kahoot2017/assets/img/enter_pin_logo.png" alt="Kahoot 4-colored shapes" />
            Join game
          </a>
        </div>
      </div>
    </>
  );
};

export default Homebar;
