import { animateScroll as scroll } from "react-scroll";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./SideBar";
import "../../index.css";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTapped, setIsTapped] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    // Check local storage for the user token
    const token = localStorage.getItem("userToken");
    setUserToken(token);
  }, []);
  const history = useNavigate();
  const location = useLocation();
  const isLoginOrRegister = location.pathname === '/login' || location.pathname === '/register';

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const scrollToTop = () => {
    scroll.scrollToTop();
    setIsTapped(false);
    setTimeout(() => setIsTapped(true), 1000);
  };

  const handleClick = () => {
    if (isLoginOrRegister) {
      // If in /login or /register, go back to the main page
      history('/');
    } else {
      // Otherwise, scroll to the top as before
      scrollToTop();
    }
  };

  return (
    <div className={`w-screen flex items-center justify-between p-4 bg-gradient-to-b ${isLoginOrRegister ? 'bg-slate-900' : 'from-slate-900 via-slate-900 to-black'} text-slate-100 top-0 z-20 overflow-x-hidden my-auto`}>
      <div>
        <button className={`flex items-center ${isLoginOrRegister ? 'bg-slate-900' : 'from-slate-900 via-slate-900 to-teal-500'}  text-teal-500 font-bold text-xl cursor-pointer  min-[700px]:hover:bg-teal-500 min-[700px]:hover:text-slate-900 rounded-lg min-[700px]:hover:scale-105 transition-all duration-300 p-4`} onClick={handleClick}>
          <FaShieldAlt className="mr-2" />
          GuardVPN
        </button>
      </div>
      <div className="hidden sm:flex items-center justify-end flex-1">
        {userToken ? (
          <RouterLink
            to="dashboard"
            className="nav-link cursor-pointer text-teal-500 font-bold hover:bg-teal-500 hover:text-slate-900 rounded-lg hover:scale-105 transition-all duration-300 text-xl p-4"
          >
            Dashboard
          </RouterLink>
        ) : (
          <>
            <RouterLink
              to="login"
              className="nav-link cursor-pointer text-teal-500 font-bold  hover:bg-teal-500 hover:text-slate-900 rounded-lg hover:scale-105 transition-all duration-300 text-xl p-4"
            >
              Login
            </RouterLink>
            <RouterLink
              to="register"
              className="nav-link cursor-pointe text-teal-500 font-bold hover:bg-teal-500 hover:text-slate-900 rounded-lg hover:scale-105 transition-all duration-300 text-xl p-4"
            >
              Register
            </RouterLink>
          </>
        )}
      </div>
      <div className="sm:hidden relative ">
        <button className="text-slate-100 text-xl cursor-pointer" onClick={toggleDropdown}>
          <GiHamburgerMenu />
        </button>
        {showDropdown && <Sidebar toggleDropdown={toggleDropdown} />}
      </div>
    </div>
  );
};

export default Navbar;
