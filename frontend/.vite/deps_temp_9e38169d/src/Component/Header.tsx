import React from 'react'

import "./Header.css"
import Notification from './Notification/Notification'
import MobileHeader from './MobileHeader/MobileHeader'
import MobileNav from './MobileNav/MobileNav'
import DeshtopNav from './DesktopNav/DeshtopNav'

const Header = () => {
  return (
    <>
    
    {/* knFFML */}
    {/* dcRaMF */}
      {/* ezSOIv */}
      <header className="sc-6baadd7-0  knFFML    ">

        <Notification/>

        <MobileHeader/>
        <MobileNav/>


        <DeshtopNav/>

      </header>
    </>
  )

}

export default Header