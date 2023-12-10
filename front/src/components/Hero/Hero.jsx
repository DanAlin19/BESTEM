import React from "react";
import Video from "../../assets/video.mp4";
import { FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <>
      <div className="h-screen w-full relative flex items-center justify-center">
        <video
          className="w-full h-screen object-cover absolute top-0 left-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={Video} type="video/mp4" />
        </video>
        <div className="flex flex-col items-center w-full justify-center text-white z-10">
          <div className="flex flex-row items-center justify-center">
            <FaShieldAlt className="text-6xl text-teal-500 mr-2" />
            <h1 className="text-6xl font-extrabold font-light text-center text-teal-500">
              GuardVPN
            </h1>
          </div>
          <h3 className="text-xl font-italic font-bold text-center text-gray-300 p-5">
            <span className="text-teal-500">Securing</span> Your Connection,{" "}
            <span className="text-teal-500">Empowering</span> Your Privacy
          </h3>
          <Link to="/register" className="bg-teal-500 hover:bg-teal-600 text-gray-800 font-bold text-xl py-3 px-6 rounded-full  transition-all duration-300">
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}

export default Hero;
