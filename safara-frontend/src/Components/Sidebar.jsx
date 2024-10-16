import { FaAd, FaHome, FaSearch, FaUsers } from "react-icons/fa";
import { MdAttachMoney, MdOutlineNoteAdd, MdPreview } from "react-icons/md";
import { TbCertificate } from "react-icons/tb";
import { SiCoursera } from "react-icons/si";
import { NavLink, useLocation } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import { FaUser } from "react-icons/fa6";

const Sidebar = () => {
  const { user } = useAuthContext();
  
  const location = useLocation();

  // Regex to match the /singleCourse/:id pattern
  const singleCourseRegex = /^\/singleCourse\/[^/]+$/;

  const navLinkStyle = ({ isActive }, path) => {
    const isSingleCoursePage = singleCourseRegex.test(location.pathname);

    // Apply active styles to the Manage Courses link if we're on that page or the /singleCourse/:id page
    const shouldApplyActiveStyle = 
      isActive || 
      (isSingleCoursePage && path === "/dashboard/admin/manageCourses");

    return {
      backgroundColor: shouldApplyActiveStyle ? "#125ca6" : "transparent",
      borderRadius: "4px",
      fontSize: "15px",
      whiteSpace: "nowrap",
      color: shouldApplyActiveStyle ? "white": "white"  ,
    };
  };

  return (
    <div className="bg-gray-800 text-white h-screen fixed left-0 top-0 bottom-0 space-y-2 w-64">
   
      <div className="w-60">
        <img src="logo.png" alt="" />
      </div>
      <ul className="menu p-4">
        {user?.user?.role === "admin" && (
          <>
          <h2 className="text-2xl font-bold pb-8 ">Admin Dashboard</h2>
            <li>
              <NavLink style={navLinkStyle} to={"/dashboard/admin/adminHome"}>
                <FaHome></FaHome>Admin Home
              </NavLink>
            </li>
            <li>
              <NavLink style={navLinkStyle} to={"/dashboard/admin/addCourses"}>
                <MdOutlineNoteAdd />
                Add Course
              </NavLink>
            </li>
            <li>
              <NavLink
                style={(navData) =>
                  navLinkStyle(navData, "/dashboard/admin/manageCourses")
                }
                to={"/dashboard/admin/manageCourses"}
              >
                <SiCoursera />
                Manage Courses
              </NavLink>
            </li>
            <li>
              <NavLink
                style={navLinkStyle}
                to={"/dashboard/admin/manageBookings"}
              >
                <FaAd />
                Manage Course Bookings
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
          <h2 className="text-2xl font-bold pb-8 ">User Dashboard</h2>
            <li>
              <NavLink style={navLinkStyle} to={"/dashboard/user/userHome"}>
                <FaHome></FaHome>User Home
              </NavLink>
            </li>
            <li>
              <NavLink
                style={navLinkStyle}
                to={"/dashboard/user/userPaymentHistory"}
              >
                <MdAttachMoney />
                Payment History
              </NavLink>
            </li>
            <li>
              <NavLink style={navLinkStyle} to={"/dashboard/user/userCourses"}>
                <SiCoursera />
                My Classes
              </NavLink>
            </li>
            <li>
              <NavLink style={navLinkStyle} to={"/dashboard/user/userReview"}>
                <MdPreview />
                Add a Review
              </NavLink>
            </li>
            <li>
              <NavLink
                style={navLinkStyle}
                to={"/dashboard/user/userCertificate"}
              >
                <TbCertificate />
                Certificate
              </NavLink>
            </li>
          </>
        )}

        {/* shared content */}
        <div className="divider bg-white h-0.5"></div>
        <li>
          <NavLink style={navLinkStyle} to={"/"}>
            <FaHome></FaHome> Home
          </NavLink>
        </li>
        <li>
          <NavLink style={navLinkStyle} to={"/AllCourses"}>
            <FaSearch />
            Courses
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
  );
};

export default Sidebar;
