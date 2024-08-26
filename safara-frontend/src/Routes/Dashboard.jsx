import {
  FaAd,
  FaCalendar,
  FaHome,
  FaList,
  FaSearch,
  FaShoppingCart,
  FaUsers,
  FaUtensilSpoon,
} from "react-icons/fa";
import { NavLink, Outlet } from "react-router-dom";

const navLinkStyle = ({ isActive }) => ({
  backgroundColor: isActive ? "" : "transparent",
  borderRadius: "4px",
  fontSize: "15px",
  whiteSpace: "nowrap",
 
});
const Dashboard = () => {
  const isAdmin = true;
  return (
    <div className="flex  text-white h-screen">
      <div className="w-64  bg-[#125ca6]">
        <ul className="menu p-4">
          {isAdmin ? (
            <>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/adminHome"}>
                  <FaHome></FaHome>Admin Home
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/addItems"}>
                  <FaUtensilSpoon></FaUtensilSpoon>Add Course
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/manageItems"}>
                  <FaList />
                  Manage Courses
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/bookings"}>
                  <FaAd />
                  Manage Course Bookings
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/allUsers"}>
                  <FaUsers />
                  All Users
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/userHome"}>
                  <FaHome></FaHome>User Home
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/paymentHistory"}>
                  {" "}
                  <FaCalendar></FaCalendar>Payment History
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/cart"}>
                  {" "}
                  <FaShoppingCart />
                  My Courses
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/userRating"}>
                  {" "}
                  <FaAd />
                  Add a Review
                </NavLink>
              </li>
              <li>
                <NavLink style={navLinkStyle} to={"/dashboard/review"}>
                  {" "}
                  <FaList />
                  Certificate
                </NavLink>
              </li>
            </>
          )}
          {/* shared  content */}
          <div className="divider divider-neutral"></div>
          <li>
            <NavLink style={navLinkStyle} to={"/"}>
              {" "}
              <FaHome></FaHome> Home
            </NavLink>
          </li>
          <li>
            <NavLink style={navLinkStyle} to={"/menu"}>
              {" "}
              <FaSearch />
              Menu
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="p-8 flex-1 text-black">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Dashboard;
