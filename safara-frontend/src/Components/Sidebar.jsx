import { useState } from "react";
import {
  FaHome,
  FaRegBuilding,
  FaSearch,
  FaTachometerAlt,
  FaUsers,
  FaBars,
  FaUser,
} from "react-icons/fa";
import { MdOutlineFeaturedVideo } from "react-icons/md";
import { GrDocumentConfig, GrDocumentUpdate } from "react-icons/gr";
import { NavLink, useLocation } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();
  const location = useLocation();
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Regex to match the /singleCourse/:id pattern
  const singleCourseRegex = /^\/singleCourse\/[^/]+$/;

  const navLinkStyle = ({ isActive }, path) => {
    const isSingleCoursePage = singleCourseRegex.test(location.pathname);

    const shouldApplyActiveStyle =
      isActive ||
      (isSingleCoursePage && path === "/dashboard/admin/manageCourses");

    return {
      backgroundColor: shouldApplyActiveStyle ? "#125ca6" : "transparent",
      borderRadius: "6px",

      fontSize: "18px",
      fontWeight: "700",
      whiteSpace: "nowrap",
      color: shouldApplyActiveStyle ? "white" : "white",
    };
  };

  return (
    <>
      {/* Hamburger button - fixed at bottom left */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 border-2 border-white text-white p-2 rounded-full shadow-lg"
      >
        <FaBars size={24} />
      </button>

      {/* Overlay when sidebar is open on mobile */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50`} // Add z-50 or a higher z-index value
      >
        <div className="w-60">
          <img src="logo.png" alt="" />
        </div>
        <ul className="menu p-4">
          {user?.user?.role === "admin" && (
            <>
              <h2 className="text-2xl font-bold pb-8">Admin Dashboard</h2>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/admin/adminHome"}>
                  <FaTachometerAlt />
                  Admin Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={navLinkStyle}
                  to={"/dashboard/admin/addCourses"}
                >
                  <GrDocumentUpdate />
                  Add Course
                </NavLink>
              </li>
              {/* <li>
                <NavLink style={navLinkStyle} to={"/dashboard/admin/manageOtherCard"}>
                  <GrDocumentUpdate />
                  Manage Other
                </NavLink>
              </li> */}
              <li>
                <NavLink
                  style={(navData) =>
                    navLinkStyle(navData, "/dashboard/admin/manageCourses")
                  }
                  to={"/dashboard/admin/manageCourses"}
                >
                  <FaRegBuilding />
                  Manage Courses
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={navLinkStyle}
                  to={"/dashboard/admin/transactionHistory"}
                >
                  <GrDocumentConfig />
                  Transaction History
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/admin/allUsers"}>
                  <FaUsers />
                  All Users
                </NavLink>
              </li>
            </>
          )}
          {user?.user?.role === "user" && (
            <>
              <h2 className="text-2xl font-bold pb-8">User Dashboard</h2>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/user/userHome"}>
                  <FaTachometerAlt />
                  User Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={navLinkStyle}
                  to={"/dashboard/user/userPaymentHistory"}
                >
                  <GrDocumentConfig />
                  Transaction History
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={navLinkStyle}
                  to={"/dashboard/user/userCourses"}
                >
                  <MdOutlineFeaturedVideo />
                  My Classes
                </NavLink>
              </li>
            </>
          )}

          {/* shared content */}
          <div className="divider bg-white h-0.5"></div>
          <li>
            <NavLink style={navLinkStyle} to={"/"}>
              <FaHome />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink style={navLinkStyle} to={"/AllCourses"}>
              <FaSearch />
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink style={navLinkStyle} to={"/others"}>
              <FaSearch />
              Others
            </NavLink>
          </li>
          <li>
            <NavLink style={navLinkStyle} to={`/profile`}>
              <FaUser />
              Profile
            </NavLink>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
