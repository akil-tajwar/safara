import { useEffect, useState } from "react";
import {
  FaHome,
  FaRegBuilding,
  FaSearch,
  FaTachometerAlt,
  FaUsers,
  FaBars,
  FaUser,
} from "react-icons/fa";
import { MdOutlineFeaturedVideo, MdOutlineFolderSpecial } from "react-icons/md";
import {
  GrDocumentConfig,
  GrDocumentUpdate,
  GrCloudUpload,
} from "react-icons/gr";
import { NavLink, useLocation } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuthContext();
  const [currentUser, setCurrentUser] = useState([]);
  const location = useLocation();
  const toggleSidebar = () => setIsOpen(!isOpen);

  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;

  const fetchAllUsers = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/user/allUsers`);
      const data = await res.json();
      const userData = data.find((u) => u._id === user?.user?._id);
      setCurrentUser(userData || {});
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    if (user?.user?._id) fetchAllUsers();
  }, [user?.user?._id]);

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
      color: "white",
    };
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 border-2 border-white text-white p-2 rounded-full shadow-lg"
      >
        <FaBars size={24} />
      </button>

      {/* Overlay for mobile */}
      <div
        onClick={toggleSidebar}
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 w-64 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50`}
      >
        <div className="w-60 p-4">
          <img src="/logo.png" alt="Logo" />
        </div>

        <ul className="menu p-4 space-y-1">
          {currentUser?.role === "admin" && (
            <>
              <h2 className="text-2xl font-bold pb-6">Admin Dashboard</h2>
              <li>
                <NavLink style={navLinkStyle} to="/dashboard/admin/adminHome">
                  <FaTachometerAlt />
                  Admin Home
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to="/dashboard/admin/addCourses">
                  <GrDocumentUpdate />
                  Add Course
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={(navData) =>
                    navLinkStyle(navData, "/dashboard/admin/manageCourses")
                  }
                  to="/dashboard/admin/manageCourses"
                >
                  <FaRegBuilding />
                  Manage Courses
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={navLinkStyle}
                  to="/dashboard/admin/otherProjectUpload"
                >
                  <GrCloudUpload />
                  Other Project Upload
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={navLinkStyle}
                  to="/dashboard/admin/transactionHistory"
                >
                  <GrDocumentConfig />
                  Transaction History
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to="/dashboard/admin/allUsers">
                  <FaUsers />
                  All Users
                </NavLink>
              </li>
            </>
          )}

          {currentUser?.role === "user" && (
            <>
              <h2 className="text-2xl font-bold pb-6">User Dashboard</h2>
              <li>
                <NavLink style={navLinkStyle} to="/dashboard/user/userHome">
                  <FaTachometerAlt />
                  User Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  style={navLinkStyle}
                  to="/dashboard/user/userPaymentHistory"
                >
                  <GrDocumentConfig />
                  Transaction History
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to="/dashboard/user/userCourses">
                  <MdOutlineFeaturedVideo />
                  My Classes
                </NavLink>
              </li>
            </>
          )}

          <div className="divider bg-white h-0.5"></div>

          <li>
            <NavLink style={navLinkStyle} to="/">
              <FaHome />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink style={navLinkStyle} to="/allCourses">
              <FaSearch />
              Courses
            </NavLink>
          </li>
          <li>
            <NavLink style={navLinkStyle} to="/others">
              <MdOutlineFolderSpecial />
              Others
            </NavLink>
          </li>
          <li>
            <NavLink style={navLinkStyle} to="/profile">
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
