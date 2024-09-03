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

   
    return (
        <div className="w-64 bg-[#125ca6] text-white h-screen">
            <div className="w-60">
                <img src="logo.png" alt="" />
            </div>
            <ul className="menu p-4">
                {/* <div className="flex gap-2 ml-4">
                    <div className="w-12 rounded border-2 border-white">
                        <img className="rounded" alt="Tailwind CSS Navbar component" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                    <h5 className="font-semibold">{user?.user?.firstname} {user?.user?.lastname}</h5>
                </div> */}
                {user?.user?.role === 'admin' && (
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
                )}
                {user?.user?.role === 'user' && (
                    <>
                        <li>
                            <NavLink style={navLinkStyle} to={"/dashboard/user/userHome"}>
                                <FaHome></FaHome>User Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink style={navLinkStyle} to={"/dashboard/user/userPaymentHistory"}>
                                {" "}
                                <FaCalendar></FaCalendar>Payment History
                            </NavLink>
                        </li>
                        <li>
                            <NavLink style={navLinkStyle} to={"/dashboard/user/userCourses"}>
                                {" "}
                                <FaShoppingCart />
                                My Courses
                            </NavLink>
                        </li>
                        <li>
                            <NavLink style={navLinkStyle} to={"/dashboard/user/userReview"}>
                                {" "}
                                <FaAd />
                                Add a Review
                            </NavLink>
                        </li>
                        <li>
                            <NavLink style={navLinkStyle} to={"/dashboard/user/userCertificate"}>
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
                    <NavLink style={navLinkStyle} to={"/AllCourses"}>
                        {" "}
                        <FaSearch />
                  Courses
                    </NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;