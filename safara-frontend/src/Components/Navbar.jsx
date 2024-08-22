import { Link } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";

const Navbar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    console.log("🚀 ~ Home ~ user:", user)
    return (
        <div className="fixed w-full py-9">
            <div className="w-3/4 mx-auto">
                <div className="flex justify-between items-center">
                    <div className="w-60">
                        <img src="logo.png" alt="" />
                    </div>
                    <div className="flex gap-10 items-center">
                        <Link>Home</Link>
                        <Link>Courses</Link>
                    </div>
                    {user ?
                        <div className="bg-[#125ca6] flex items-center gap-5 rounded-full">
                            <p className="pl-3 text-white font-semibold">{user?.user?.firstname} {user?.user?.lastname}</p>
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-12 mt-1 mr-1 rounded-full border-2 border-white">
                                        <img
                                            alt="Tailwind CSS Navbar component"
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <li><a>Profile</a></li>
                                    <li><a>Settings</a></li>
                                    <li onClick={logout}><a>Logout</a></li>
                                </ul>
                            </div>
                        </div> :
                        <div className="flex gap-10 items-center">
                            <Link to={'/login'}>Login</Link>
                            <Link to={'/signup'} className="bg-[#125ca6] text-white px-3 pt-1 pb-[0.4rem] rounded-md">Signup</Link>
                        </div>}
                </div>
            </div>
        </div>
    );
};

export default Navbar;