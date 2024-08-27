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
import { NavLink } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const Sidebar = () => {
    const { user } = useAuthContext();
    console.log("🚀 ~ Sidebar ~ user:", user?.user?.role)

    const navLinkStyle = ({ isActive }) => ({
        backgroundColor: isActive ? "white" : "transparent",
        borderRadius: "4px",
        fontSize: "15px",
        whiteSpace: "nowrap",
        color: isActive ? "#125ca6" : "white"
    });
    
    const isAdmin = true;
    return (
        <div className="w-64 bg-[#125ca6] text-white h-screen">
            <div className="w-60">
                <img src="logo.png" alt="" />
            </div>
            <ul className="menu p-4">
                {isAdmin ? (
                    <>
                        <li>
                            <NavLink style={navLinkStyle} to={"/dashboard/admin/adminHome"}>
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
                            <NavLink style={navLinkStyle} to={"/dashboard/admin/allUsers"}>
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
                <div className="divider bg-white h-0.5"></div>
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
    );
};

export default Sidebar;