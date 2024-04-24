import React, { useContext } from "react";
import { MdStars } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { IoIosColorPalette } from "react-icons/io";

import { AuthContext } from "../context/AuthContext";

import { AiOutlineEye } from "react-icons/ai";
import "./Header.css";
import { Link } from "react-router-dom";
import logo from "../assets/logoofcreatequiz.jpg"

const Header = ({ handleToggleModalSetting, createdquizdatatitle }) => {
  const { user, logoutUser, removeCreatedQuizId } = useContext(AuthContext);
  return (
    <>
      <div className=" w-screen fixed  h-[56px] flex z-40 bg-white   justify-items-start   items-center font-sans px-[16px]  ">
        <a className="pr-[20px]" href="/"><span >
         <img className=" w-40" src={logo} alt="" />
        </span></a>
        

        <button onClick={handleToggleModalSetting}>
          {" "}
          <div className="flex h-[42px] justify-between  bg-white rounded-md border-[0.5px] border-[#484848]  justify-center items-center w-[320.4px] h-[42.4px]  text-[#6E6E6E]  font-extrabold">
            <span>
              {" "}
              <span className="pl-4">
                <span>
                  {" "}
                  {createdquizdatatitle
                    ? createdquizdatatitle
                    : "Enter kahoot title... "}{" "}
                </span>
              </span>
            </span>
            <span>
              {" "}
              <div className="bg-[#F2F2F2]    px-[13px] py-[7px] ml-[12px]  text-sm/[16px]    mr-[4px] ">
                Setting
              </div>
            </span>
          </div>
        </button>

        <div className="flex items-center justify-center w-[180.663px] h-[42px]">
          <TiTick size="24px" className="ml-[8px]" />
          <div>
            <span>saved to:Your drafts</span>
          </div>
        </div>

        <div className="w-[347px]"></div>

        <button className="flex items-center justify-center  text-[#028282]  pt-[8px] pr-[16px] pb-[6px] font-semibold ">
          <MdStars color="#028282" size="24px" />
          <span className="mx-[8px]">Upgrade</span>
        </button>

        <button className="bg-[#1368CE]  flex items-center text-white font-semibold rounded-md  px-[8px]    mx-[4px] ">
          <IoIosColorPalette />
          <span className="h-[42px] w-[88px] items-center justify-center flex">
            Themes
          </span>
        </button>

        <button className="bg-[#F2F2F2] px-[8px] mx-[4px] flex items-center justify-center h-[42px]">
          <AiOutlineEye />
          <span className="px-[8px] ">Preview</span>
        </button>

        <div className="w-[1px] h-[40px]"></div>

        {user ? (
          <button
            className="bg-[#F2F2F2] h-[38px] px-[16px] pb-[4px]  font-semibold mr-[8px] rounded-md"
            onClick={() => {
              logoutUser();
              removeCreatedQuizId();
            }}
          >
            Exit
          </button>
        ) : (

          <button className="bg-[#F2F2F2] h-[38px] px-[16px] pb-[4px]  font-semibold mr-[8px] rounded-md">  <Link to='/register'>Register</Link>  </button>
        
        )}

{user ? (
          <button className="bg-[#1368CE]  text-white pb-[4px] px-[16px] h-[34px] rounded-md  ">
          Save
        </button>
        ) : (

          <button className="bg-[#F2F2F2] h-[38px] px-[16px] pb-[4px]  font-semibold mr-[8px] rounded-md">  <Link to='/login'>Login</Link>  </button>
        
        )}

       
      </div>
    </>
  );
};

export default Header;
