import React from 'react'
import "../../questiontype/Mcq.css"
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

const Menudots = () => {
  return (
    <div>
      <div
            class="ActionMenu"
            aria-haspopup="true"
          >
            <button
              id="action-menu__toggle-question-action-menu"
              aria-label="Duplicate, delete question or add additional features."
              aria-expanded="false"
              data-functional-selector="action-menu__toggle"
              data-onboarding-step="action-menu__toggle-question-action-menu"
              tabindex="0"
              class="icon-button__ IconButton"
            >
              <span
                class="icon__Icon"
                data-functional-selector="icon"
              
              >
                <PiDotsThreeOutlineVerticalFill color="#000" />
               
              </span>
            </button>
          </div>
    </div>
  )
}

export default Menudots