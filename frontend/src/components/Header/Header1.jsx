import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { TiTick } from "react-icons/ti";
import logo from "../../assets/logoofcreatequiz.jpg";
import { AuthContext } from "../../context/AuthContext";

const Header1 = ({ handleToggleModalSetting, createdquizdatatitle }) => {
  const { user, logoutUser, removeCreatedQuizId } = useContext(AuthContext);
  const location = useLocation();

  const isHomePage = () => {
    return location.pathname === "/";
  };

  const isLoginOrRegisterPage = () => {
    return location.pathname === "/login" || location.pathname === "/register";
  };

  const headerClasses = isHomePage()
    ? " m-4  flex z-[200] bg-white justify-between items-center font-sans "
    : " m-4  flex z-[200] bg-white justify-between items-center font-sans ";

  return (
    <>
      <div className={headerClasses}>
        <Link to="/" className="">
          <img className="w-40" src={logo} alt="Logo" />
        </Link>
        {!isLoginOrRegisterPage() && isHomePage() && (
          <form className="w-[37rem]">
            <label
              htmlFor="default-search"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div className="relative">
              <input
                type="search"
                id="default-search"
                className="block w-full pl-9 p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search the quiz here ...."
                required
              />
              <button
                type="submit"
                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </form>
        )}

        {!isLoginOrRegisterPage() && !isHomePage() && (
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
        )}

        {!isLoginOrRegisterPage() && !isHomePage() && (
          <>
            <div className="flex h-10 items-center w-96 text-gray-700 font-bold">
              <input
                type="text"
                placeholder="Search for quizzes..."
                className="w-full h-full px-4 py-2 border border-gray-400 rounded-md"
              />
            </div>
            <div className="flex items-center justify-center w-44">
              <TiTick size="24px" className="ml-2" />
              <span className="ml-1 text-sm">saved to: Your drafts</span>
            </div>
          </>
        )}
        <div className="flex-grow"></div>
        {!isLoginOrRegisterPage() && (
          <>
            {!isHomePage() && (
              <>
                <div className="flex items-center justify-center w-44">
                  <TiTick size="24px" className="ml-2" />
                  <span className="ml-1 text-sm">saved to: Your drafts</span>
                </div>
              </>
            )}
            
          </>
        )}
        {user ? (
          <button
            className="bg-gray-200 h-9 px-4 pb-1 font-semibold mr-2 rounded-md"
            onClick={() => {
              logoutUser();
              removeCreatedQuizId();
            }}
          >
            Logout
          </button>
        ) : (
          <Link
            to="/register"
            className="bg-gray-200 h-9 px-4 pb-1 font-semibold mr-2 rounded-md"
          >
            Register
          </Link>
        )}

        <Link
          to="/login"
          className="bg-gray-200 h-9 px-4 pb-1 font-semibold mr-2 rounded-md"
        >
          Login
        </Link>
      </div>
     
    </>
  );
};

export default Header1;
