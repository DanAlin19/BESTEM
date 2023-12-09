import { Link, animateScroll as scroll } from "react-scroll"
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./SideBar";
import "../../index.css";


const Navbar = () => {

  const [showDropdown, setShowDropdown] = useState(false);
  const [isTapped, setIsTapped] = useState(true);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


  const scrollToTop = () => {
    scroll.scrollToTop();
    setIsTapped(false);
    setTimeout(() => setIsTapped(true), 1000);
  };

  return (
    <div className="w-screen flex items-center justify-between p-4 bg-slate-900 text-slate-100 fixed top-0 z-20 overflow-x-hidden my-auto">
      <div>
        <button className={`flex items-center bg-${isTapped ? 'slate-900' : 'slate-100'} text-${isTapped ? 'slate-100' : 'slate-900'} text-xl cursor-pointer  min-[700px]:hover:bg-slate-100 min-[700px]:hover:text-slate-900 rounded-lg min-[700px]:hover:scale-105 transition-all duration-300 p-4`} onClick={scrollToTop}>
          <FaShieldAlt className="mr-2" />
            GuardVPN
        </button>
      </div>
      <div className="hidden sm:flex items-center justify-end flex-1">
        <RouterLink
          activeClass="active"
          to="login"
          spy={true}
          smooth={true}
          offset={-50}
          duration={500}
          className="nav-link cursor-pointer  hover:bg-slate-100 hover:text-slate-900 rounded-lg hover:scale-105 transition-all duration-300 text-xl p-4"
        >
          Login
        </RouterLink>
        <RouterLink
          activeClass="active"
          to="register"
          spy={true}
          smooth={true}
          offset={-50}
          duration={500}
          className="nav-link cursor-pointer  hover:bg-slate-100 hover:text-slate-900 rounded-lg hover:scale-105 transition-all duration-300 text-xl p-4"
        >
          Register
        </RouterLink>
      </div>
      <div className="sm:hidden relative ">
        <button className="text-slate-100 text-xl cursor-pointer" onClick={toggleDropdown}>
          <GiHamburgerMenu/>
        </button>
        {showDropdown && <Sidebar toggleDropdown={toggleDropdown}/>}
      </div>
    </div>
  );
};

export default Navbar;