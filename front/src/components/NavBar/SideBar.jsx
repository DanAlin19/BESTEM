import { Link } from "react-scroll";
import "../../index.css";

function SideBar(props) {
  const userToken = localStorage.getItem("userToken");

  return (
    <div className="fixed flex flex-col z-40 bg-slate-900 text-white top-20 right-0 rounded-lg">
      <div className="flex flex-col items-center justify-center">
        {userToken ? (
          <Link
            to="dashboard"
            spy={true}
            smooth={true}
            offset={-50}
            duration={500}
            className="nav-link cursor-pointer rounded-lg hover:scale-105 transition-all duration-300 text-md p-4"
            onClick={props.toggleDropdown}
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="research-section"
              spy={true}
              smooth={true}
              offset={-50}
              duration={500}
              className="nav-link cursor-pointer rounded-lg hover:scale-105 transition-all duration-300 text-md p-4"
              onClick={props.toggleDropdown}
            >
              Login
            </Link>
            <Link
              to="awards-section"
              spy={true}
              smooth={true}
              offset={-50}
              duration={500}
              className="nav-link cursor-pointer rounded-lg hover:scale-105 transition-all duration-300 text-md p-4"
              onClick={props.toggleDropdown}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default SideBar;
