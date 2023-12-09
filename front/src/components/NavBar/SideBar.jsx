import { Link } from "react-scroll"
import "../../index.css"


function SideBar(props) {
  return (
    <div className="fixed flex flex-col z-40 bg-slate-900 text-white top-20 right-0 rounded-lg">
       <div className="flex flex-col items-center justify-center">
    <Link
        activeClass="active"
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
      activeClass="active"
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
  </div>
    </div>

  )
}

export default SideBar