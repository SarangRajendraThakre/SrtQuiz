import React, { useContext, useState } from "react";
import { 
  MdStars, 
  MdNotificationsNone, // Using a clean notification icon
} from "react-icons/md";
import { 
  IoIosColorPalette, 
  IoIosSearch,
  IoIosCloseCircleOutline, // For the close button on mobile search
} from "react-icons/io";
import { AiOutlineEye, AiOutlineMenu, AiOutlineClose, AiOutlineUser } from "react-icons/ai"; // Keeping these for consistency

import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logoofcreatequiz.jpg";
import { AuthContext } from "../../context/AuthContext";
import { useQuiz } from "../../context/QuizContext";
import LiveSearchInput from "../../pages/LiveSearchInput";

const Headermain = ({ handleToggleModalSetting, createdquizdatatitle }) => {
  const { user, logoutUser } = useContext(AuthContext);
  const { toggleRightsideVisibility, updateCreatedQuizId } = useQuiz();
  const location = useLocation();

  // State for mobile menu visibility (used for hamburger)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  // NEW STATE: Tracks if the search bar is active/focused, primarily for mobile
  const [isSearchActive, setIsSearchActive] = useState(false);

  const isQuizCreationPage = location.pathname.startsWith('/createquiz');
  const isLoginOrRegisterPage = location.pathname === "/login" || location.pathname === "/register";
  const isStandardPage = !isQuizCreationPage && !isLoginOrRegisterPage;

  const handleLogout = () => {
    logoutUser();
    updateCreatedQuizId(null);
    localStorage.removeItem("createdQuizId");
    setIsMobileMenuOpen(false); 
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
    // Ensure search is not active when opening the menu
    if (isSearchActive) {
      setIsSearchActive(false);
    }
  };

  const handleFocusSearch = () => {
    // Activate search mode only on small screens
    if (window.innerWidth < 768) { // Assuming md: is 768px
      setIsSearchActive(true);
    }
  };

  const handleBlurSearch = () => {
    // This function is kept for completeness but is not strictly necessary 
    // since we rely on the explicit close button for mobile search mode deactivation.
  };

  const MobileAuthButtons = () => (
    <>
      {user ? (
        <>
          <Link 
            to="/profile" 
            className="w-full flex items-center justify-start py-2 px-3 font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition"
            onClick={toggleMobileMenu}
          >
            <AiOutlineUser size={20} className="mr-2"/> Profile
          </Link>
          <button
            className="w-full flex items-center justify-start py-2 px-3 font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition"
            onClick={handleLogout}
          >
             <AiOutlineClose size={20} className="mr-2"/> Logout
          </button>
        </>
      ) : (
        <>
          <Link 
            to="/register" 
            className="w-full text-center py-2 font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition"
            onClick={toggleMobileMenu}
          >
            Register
          </Link>
          <Link 
            to="/login" 
            className="w-full text-center py-2 font-semibold bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            onClick={toggleMobileMenu}
          >
            Login
          </Link>
        </>
      )}
    </>
  );

  // Use a simplified LiveSearchInput component wrapper to capture focus/blur events
  const SearchInputWrapper = () => (
    <div 
      className={`relative transition-all duration-300 ease-out 
        ${isSearchActive ? 'w-full md:max-w-md' : 'w-full max-w-md md:max-w-xs'}`}
    >
      <div 
        onFocus={handleFocusSearch} 
        onBlur={handleBlurSearch}
        className="w-full"
      >
        <LiveSearchInput />
      </div>
    </div>
  );


  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        
        {/* 1. Logo (Hidden when search is active on mobile) */}
        <Link 
          to="/" 
          className={`flex-shrink-0 transition-all duration-300 
            ${isSearchActive ? 'hidden md:flex' : 'flex'}`}
        >
          <img className="w-28 md:w-40" src={logo} alt="Logo" />
        </Link>

        {/* 2. Middle Section: Search or Quiz Title */}
        {isStandardPage && (
          // Standard page: Show Search Bar
          <div className={`flex items-center justify-center transition-all duration-300 
            ${isSearchActive ? 'flex-1 mx-0' : 'flex-1 md:mx-4 mx-2 max-w-[calc(100%-8rem)] md:max-w-lg'}`}
          >
            <div className="w-full">
              <SearchInputWrapper />
            </div>
          </div>
        )}
        {/* Quiz Creation Page */}
        {isQuizCreationPage && (
          <div className="flex-1 flex items-center justify-center mx-4 max-w-lg">
            <button onClick={handleToggleModalSetting} className="flex-1">
              <div className="flex h-10 justify-between items-center bg-white rounded-md border border-gray-300 px-3 text-gray-700 font-bold w-full shadow-sm hover:shadow transition">
                <span className="truncate">
                  {createdquizdatatitle || "Enter Quiz title..."}
                </span>
                <div className="bg-gray-200 px-3 py-1 text-sm rounded">
                  Setting
                </div>
              </div>
            </button>
          </div>
        )}
        
        {/* 3. Right Side: Notifications, Dashboard, or Mobile Icons */}
        {!isLoginOrRegisterPage && (
          <div className={`flex items-center gap-3 transition-all duration-300`}>
            
            {/* Mobile Close Button (Visible when search is active) */}
            {isSearchActive && (
              <button 
                onClick={() => setIsSearchActive(false)} 
                className="md:hidden p-2 text-gray-700 hover:text-red-500 transition"
              >
                <IoIosCloseCircleOutline size={30} />
              </button>
            )}

            {/* Desktop Icons (Hidden on mobile or when search is active) */}
            <div className={`hidden md:flex items-center gap-3 ${isSearchActive ? 'opacity-0' : 'opacity-100'}`}>
              
              {/* Notification Icon (Desktop Only) */}
              {user && isStandardPage && (
                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition">
                  <MdNotificationsNone size={24} />
                </button>
              )}

              {/* Dashboard/Profile Button */}
              {user ? (
                <Link to="/profile" className="flex items-center px-4 py-2 font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md">
                  <AiOutlineUser size={20} className="mr-1"/> Dashboard
                </Link>
              ) : (
                <Link to="/login" className="px-4 py-2 font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button (Hamburger/Close) (Visible on mobile, hidden when search is active) */}
            {isStandardPage && (
              <button
                onClick={toggleMobileMenu}
                className={`md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition 
                  ${isSearchActive ? 'hidden' : 'block'}`}
              >
                {isMobileMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
              </button>
            )}

            {/* Quiz Creation Play/Theme buttons (Desktop and Mobile (in menu)) */}
            {isQuizCreationPage && (
              <>
                {/* Desktop Buttons */}
                <button className="hidden md:flex items-center justify-center text-green-600 px-3 py-2 font-semibold rounded hover:bg-green-100 transition">
                  <MdStars color="#028282" size={24} />
                  <span className="ml-1">Upgrade</span>
                </button>
                <button
                  onClick={toggleRightsideVisibility}
                  className="hidden md:flex items-center justify-center bg-blue-600 text-white px-3 py-2 font-semibold rounded hover:bg-blue-700 transition"
                >
                  <IoIosColorPalette />
                  <span className="ml-1">Themes</span>
                </button>
                <Link
                  to="/play" 
                  className="bg-green-600 text-white px-4 py-2 font-semibold rounded hover:bg-green-700 transition"
                >
                  Play
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown (Conditionally rendered, only on standard pages when NOT searching) */}
      {isMobileMenuOpen && isStandardPage && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg p-4 md:hidden z-40 space-y-2 border-t border-gray-100">
          <MobileAuthButtons />
          {user && (
            <button 
              className="w-full flex items-center justify-start py-2 px-3 font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition"
              onClick={toggleMobileMenu}
            >
              <MdNotificationsNone size={20} className="mr-2"/> Notifications
            </button>
          )}
          {/* REMOVED DUPLICATE LOGOUT BUTTON */}
        </div>
      )}

       {/* Mobile Menu Dropdown (Conditionally rendered, only on Quiz Creation pages) */}
      {isMobileMenuOpen && isQuizCreationPage && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg p-4 md:hidden z-40 space-y-2 border-t border-gray-100">
          <button className="w-full flex items-center justify-center text-green-600 px-3 py-2 font-semibold rounded hover:bg-green-100 transition">
            <MdStars color="#028282" size={24} />
            <span className="ml-1">Upgrade</span>
          </button>
          <button
            onClick={() => { toggleRightsideVisibility(); toggleMobileMenu(); }}
            className="w-full flex items-center justify-center bg-blue-600 text-white px-3 py-2 font-semibold rounded hover:bg-blue-700 transition"
          >
            <IoIosColorPalette />
            <span className="ml-1">Themes</span>
          </button>
          <Link
            to="/play" 
            className="w-full text-center bg-green-600 text-white px-4 py-2 font-semibold rounded hover:bg-green-700 transition"
            onClick={toggleMobileMenu}
          >
            Play
          </Link>
        </div>
      )}
    </header>
  );
};

export default Headermain;
