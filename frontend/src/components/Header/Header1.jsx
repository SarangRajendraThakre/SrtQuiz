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

  // Your headerClasses are identical, so you can simplify this.
  // Add fixed position here if Header1 is always meant to be fixed,
  // otherwise, a parent component should control its position.
  // For now, let's assume it should be fixed at the top if it's the only header.
  // If it's used with `toolbar_container` or `Headermain`, then its positioning should be external.
  // Based on your earlier questions, you have multiple headers.
  // So, let's just make sure the internal classes are good.
  const headerClasses = "w-full h-14 flex z-[200] bg-white justify-between items-center font-sans px-8 pt-5 ";
  // Note: I removed 'm-4' and 'pt-4 p-8' as they conflict with 'w-full' and 'px-4' for consistent fixed header.
  // If 'm-4' (margin: 1rem) is intended to shrink the header from edges, you might want padding or adjust width.
  // For a fixed header that spans full width, `w-full` and `px-4` (or similar horizontal padding) is more typical.

  return (
    <>
      {/* If Header1 is intended to be fixed at the top for ALL pages it's on,
          and not part of a complex stacked header layout, you might re-add 'fixed top-0' here.
          However, based on previous context, this might be dynamically positioned by a parent.
          For now, just cleaning up the button styles. */}
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

        {/* This block seems to be an alternative to the search bar for non-home, non-login/register pages */}
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

        {/* This seems to be another alternative input field, and then 'saved to: Your drafts' text */}
        {!isLoginOrRegisterPage() && !isHomePage() && (
          <>
            <div className="flex h-10 items-center w-96 text-gray-700 font-bold">
              <input
                type="text"
                placeholder="Search for quizzes..."
                className="w-full h-full px-4 py-2 border border-gray-400 rounded-md"
              />
            </div>
            {/* This div seems duplicated in the code */}
            {/* <div className="flex items-center justify-center w-44">
              <TiTick size="24px" className="ml-2" />
              <span className="ml-1 text-sm">saved to: Your drafts</span>
            </div> */}
          </>
        )}
        <div className="flex-grow"></div> {/* Pushes content to sides */}

        {/* This block seems to contain the "saved to: Your drafts" that was duplicated */}
        {/* If it's always meant to be present when not login/register, keep it. */}
        {/* Your logic !isLoginOrRegisterPage() && !isHomePage() && (  is used above this too.
            So this block might only appear on specific non-home, non-login/register pages. */}
        {!isLoginOrRegisterPage() && (
          <>
            {!isHomePage() && (
              <>
                {/* This `saved to: Your drafts` div is repeated. It should ideally be in one place. */}
                <div className="flex items-center justify-center w-44">
                  <TiTick size="24px" className="ml-2" />
                  <span className="ml-1 text-sm">saved to: Your drafts</span>
                </div>
              </>
            )}
          </>
        )}

        {/* --- Login/Register/Logout Buttons --- */}
        {user ? (
          <button
            className="bg-gray-200 px-4 py-2 font-semibold mr-2 rounded-md" // Changed h-9 pb-1 to py-2
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
            className="bg-gray-200 px-4 py-2 font-semibold mr-2 rounded-md" // Changed h-9 pb-1 to py-2
          >
            Register
          </Link>
        )}

        {/* This Login Link seems to be always present, even if user is logged in, which is unusual.
            Typically, if user is logged in, you don't show Login/Register.
            If user is NOT logged in, you show Login/Register.
            Your current code has:
            `user ? <Logout Button> : <Register Link>`
            Then a separate `<Login Link>` always.
            Let's make sure Login/Register only show when NOT logged in.
            And Save button for logged in users on specific pages.
        */}
        {/* Original: <Link to="/login" className="bg-gray-200 h-9 px-4 pb-1 font-semibold mr-2 rounded-md"> Login </Link> */}

        {/* Revised Login/Save (assuming a Save button is also needed) */}
        {!user ? (
          <Link
            to="/login"
            className="bg-gray-200 px-4 py-2 font-semibold rounded-md" // Changed h-9 pb-1 to py-2, removed mr-2 if last button
          >
            Login
          </Link>
        ) : (
          // Assuming a "Save" button for logged-in users, otherwise remove this else block
          // if Logout is the only other option for logged-in users.
          // This "Save" button was in your Headermain component earlier.
          // If this Header1 is meant to be a general header, you might not need a Save button here.
          // Adjust based on your actual UI flow.
          // For now, removing the Save button if Header1 is general purpose.
          null
        )}
      </div>
    </>
  );
};

export default Header1;