import React, { useContext } from 'react'
import { MdStars } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { IoIosColorPalette } from "react-icons/io";

import { AuthContext } from '../context/AuthContext'

import { AiOutlineEye } from "react-icons/ai";
import "./Header.css";

const Header = ({ handleToggleModalSetting, createdquizdatatitle }) => {

  
  const{user,logoutUser,removeCreatedQuizId}=useContext(AuthContext);
  return (
    
    <>                
      <div className=' w-screen fixed  h-[56px] flex z-40 bg-white   justify-items-start   items-center font-sans px-[16px]  '>
  
  <span className='pr-[20px]'>
  
  <svg xmlnsXlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 30" height="40px" width="120px">
  
  
  
    <path id="path-logo-1" d="M25.8673614,25.2609161 L26.9796407,28.4565254 L24.3624672,30 L21.7014544,28.1738547 L22.94467,25.2609161 L25.8673614,25.2609161 Z M5.06015324,1.6521733 L5.06015324,11.8043424 L13.6098065,3.67379058 L17.9937466,5.34777321 L11.7776686,12.1521733 L15.8999303,26.9566114 L11.4286993,26.9566114 L8.13531269,15.6086023 L5.01650782,18.6087396 L5.06015324,26.9566114 L0,26.7826007 L0,2.93482527 L5.06015324,1.6521733 Z M49.822,6.1 L49.471,7.936 L43.261,14.092 L43.55872,14.13586 C44.92624,14.36042 45.988,14.8633 46.744,15.6445 C47.554,16.4815 47.959,17.566 47.959,18.898 C47.959,20.122 47.626,21.211 46.96,22.165 C46.294,23.119 45.349,23.866 44.125,24.406 C42.901,24.946 41.497,25.216 39.913,25.216 C38.491,25.216 37.1995,25.0045 36.0385,24.5815 C34.8775,24.1585 33.964,23.578 33.298,22.84 L33.298,22.84 L34.702,20.761 L34.8895,20.9606667 C35.4095,21.4815556 36.0895,21.91 36.9295,22.246 C37.8745,22.624 38.923,22.813 40.075,22.813 C41.713,22.813 42.9865,22.4755 43.8955,21.8005 C44.8045,21.1255 45.259,20.203 45.259,19.033 C45.259,17.125 43.873,16.171 41.101,16.171 L41.101,16.171 L39.67,16.171 L40.048,14.281 L45.907,8.449 L36.862,8.449 L37.348,6.1 L49.822,6.1 Z M61.648,5.884 C62.602,5.884 63.4885,5.9785 64.3075,6.1675 C65.1265,6.3565 65.815,6.631 66.373,6.991 L66.373,6.991 L65.131,9.124 L64.9331837,8.99754082 C64.0544898,8.46984694 62.8964286,8.206 61.459,8.206 C59.911,8.206 58.588,8.5525 57.49,9.2455 C56.392,9.9385 55.546,10.8475 54.952,11.9725 C54.358,13.0975 53.98,14.317 53.818,15.631 C55.024,14.227 56.761,13.525 59.029,13.525 C60.163,13.525 61.189,13.7365 62.107,14.1595 C63.025,14.5825 63.7585,15.2035 64.3075,16.0225 C64.8565,16.8415 65.131,17.809 65.131,18.925 C65.131,20.185 64.8295,21.292 64.2265,22.246 C63.6235,23.2 62.7955,23.9335 61.7425,24.4465 C60.6895,24.9595 59.497,25.216 58.165,25.216 C56.743,25.216 55.492,24.9235 54.412,24.3385 C53.332,23.7535 52.4905,22.885 51.8875,21.733 C51.2845,20.581 50.983,19.186 50.983,17.548 C50.983,15.64 51.3565,13.7995 52.1035,12.0265 C52.8505,10.2535 54.025,8.7865 55.627,7.6255 C57.229,6.4645 59.236,5.884 61.648,5.884 Z M77.146,5.884 C79.144,5.884 80.7055,6.496 81.8305,7.72 C82.9555,8.944 83.518,10.645 83.518,12.823 C83.518,15.019 83.122,17.0665 82.33,18.9655 C81.538,20.8645 80.4175,22.381 78.9685,23.515 C77.5195,24.649 75.859,25.216 73.987,25.216 C71.989,25.216 70.423,24.604 69.289,23.38 C68.155,22.156 67.588,20.455 67.588,18.277 C67.588,16.081 67.984,14.0335 68.776,12.1345 C69.568,10.2355 70.6885,8.719 72.1375,7.585 C73.5865,6.451 75.256,5.884 77.146,5.884 Z M19.4112918,0 L28.3537538,1.69563729 L24.9077052,23.5869528 L19.4112918,0 Z M58.435,15.712 C57.067,15.712 55.9645,16.072 55.1275,16.792 C54.2905,17.512 53.872,18.421 53.872,19.519 C53.872,20.131 54.0385,20.7025 54.3715,21.2335 C54.7045,21.7645 55.1905,22.1965 55.8295,22.5295 C56.4685,22.8625 57.229,23.029 58.111,23.029 C59.407,23.029 60.4555,22.6735 61.2565,21.9625 C62.0575,21.2515 62.458,20.293 62.458,19.087 C62.458,18.025 62.089,17.197 61.351,16.603 C60.613,16.009 59.641,15.712 58.435,15.712 Z M76.93,8.287 C75.58,8.287 74.401,8.791 73.393,9.799 C72.385,10.807 71.6155,12.0805 71.0845,13.6195 C70.5535,15.1585 70.288,16.693 70.288,18.223 C70.288,19.699 70.63,20.833 71.314,21.625 C71.998,22.417 72.961,22.813 74.203,22.813 C75.535,22.813 76.705,22.309 77.713,21.301 C78.721,20.293 79.4905,19.0195 80.0215,17.4805 C80.5525,15.9415 80.818,14.407 80.818,12.877 C80.818,11.401 80.476,10.267 79.792,9.475 C79.108,8.683 78.154,8.287 76.93,8.287 Z"    fill="rgb(70,23,143)" > </path>
  
  
  </svg></span>
  
 <button onClick={handleToggleModalSetting}> <div className='flex h-[42px] justify-between  bg-white rounded-md border-[0.5px] border-[#484848]  justify-center items-center w-[320.4px] h-[42.4px]  text-[#6E6E6E]  font-extrabold'>
    <span> <span className='pl-4' ><span> {createdquizdatatitle ? createdquizdatatitle : "Enter kahoot title... "} </span>
</span>
  </span>
   <span> <div className='bg-[#F2F2F2]    px-[13px] py-[7px] ml-[12px]  text-sm/[16px]    mr-[4px] '>Setting</div>
   </span>
   
  </div></button> 
 
  <div className='flex items-center justify-center w-[180.663px] h-[42px]'>
    <TiTick size="24px" className='ml-[8px]'/>
    <div><span>saved to:Your drafts</span></div>
  </div>
  
  <div className='w-[347px]'>
  
  
  </div>
  
  
  <button className='flex items-center justify-center  text-[#028282]  pt-[8px] pr-[16px] pb-[6px] font-semibold '>
    <MdStars color='#028282' size="24px"/>
    <span className='mx-[8px]'>Upgrade</span></button>
  
    <button className='bg-[#1368CE]  flex items-center text-white font-semibold rounded-md  px-[8px]    mx-[4px] '>
  <IoIosColorPalette/>
    <span className='h-[42px] w-[88px] items-center justify-center flex' >Themes</span>
    </button>
  
    <button className='bg-[#F2F2F2] px-[8px] mx-[4px] flex items-center justify-center h-[42px]'>
      <AiOutlineEye/><span className='px-[8px] '>Preview</span>
  
  
    </button>
  
    <div className='w-[1px] h-[40px]'></div>
  
    <button className='bg-[#F2F2F2] h-[38px] px-[16px] pb-[4px]  font-semibold mr-[8px] rounded-md' onClick={() => { logoutUser(); removeCreatedQuizId(); }}>Exit</button>

  
    <button className='bg-[#1368CE]  text-white pb-[4px] px-[16px] h-[34px] rounded-md  '>Save</button>
  
  
  
      </div>
     
  
      </>
  )
}

export default Header