import React, { useContext } from "react";
import { MdStars } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { IoIosColorPalette } from "react-icons/io";
import { AiOutlineEye } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logoofcreatequiz.jpg";
import { AuthContext } from "../../context/AuthContext";
import { useQuiz } from "../../context/QuizContext"; // Import the QuizContext

const Header = ({ handleToggleModalSetting, createdquizdatatitle }) => {
  const { user, logoutUser, removeCreatedQuizId } = useContext(AuthContext);
  const location = useLocation();
  const { toggleRightsideVisibility } = useQuiz(); // Access the toggle function from the QuizContext

  const isLoginOrRegisterPage = () => {
    return location.pathname === "/login" || location.pathname === "/register";
  };

  return (
    <>
      <div className="w-full fixed h-14 flex z-[200] bg-white justify-between items-center font-sans px-4">
        <Link to="/" className="pr-4">
          <img className="w-40" src={logo} alt="Logo" />
        </Link>
        {!isLoginOrRegisterPage() && (
          <>
            <button onClick={handleToggleModalSetting}>
              <div className="flex h-10 justify-between bg-white rounded-md border border-gray-400 justify-center items-center w-96 text-gray-700 font-bold">
                <span className="pl-4">
                  {createdquizdatatitle
                    ? createdquizdatatitle
                    : "Enter kahoot title..."}
                </span>
                <div className="bg-gray-200 px-4 py-2 ml-2 text-sm mr-4">
                  Setting
                </div>
              </div>
            </button>
            <div className="flex items-center justify-center w-44">
              <TiTick size="24px" className="ml-2" />
              <span className="ml-1 text-sm">saved to: Your drafts</span>
            </div>
          </>
        )}
        <div className="flex-grow"></div>
        {!isLoginOrRegisterPage() && (
          <>
            <button className="flex items-center justify-center  text-green-600 pt-2 pr-4 pb-1 font-semibold ">
              <MdStars color="#028282" size="24px" />
              <span className="mx-2">Upgrade</span>
            </button>
            <button onClick={toggleRightsideVisibility} className="bg-blue-600 flex items-center text-white font-semibold rounded-md px-2 mx-1">
              <IoIosColorPalette />
              <span className="flex items-center justify-center w-24">
                Themes
              </span>
            </button>
            <button className="bg-gray-200 px-2 mx-1 flex items-center justify-center h-10">
              <AiOutlineEye />
              <span className="px-2">Preview</span>
            </button>
          </>
        )}
        <div className="w-1 h-10 bg-gray-300"></div>
        {user ? (
          <button
            className="bg-gray-200 h-9 px-4 pb-1 font-semibold mr-2 rounded-md"
            onClick={() => {
              logoutUser();
              removeCreatedQuizId();
            }}
          >
            Exit
          </button>
        ) : (
          <Link
            to="/register"
            className="bg-gray-200 h-9 px-4 pb-1 font-semibold mr-2 rounded-md"
          >
            Register
          </Link>
        )}
        {user ? (
          <button className="bg-blue-600 text-white pb-1 px-4 h-8 rounded-md">
            Save
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-gray-200 h-9 px-4 pb-1 font-semibold mr-2 rounded-md"
          >
            Login
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
