import React, { useState } from "react";
import { MdOutlineKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const Rightside = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
      <div className="rightsidebarmain"></div>
    </div>
  );
};

export default Rightside;
