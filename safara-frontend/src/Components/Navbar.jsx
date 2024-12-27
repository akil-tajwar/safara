import { Link } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
import logo from "../../public/logo.png";
import { CgProfile } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout } from "react-icons/md";
import { HiMenu } from "react-icons/hi";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user } = useAuthContext();
  const [userData, setUserData] = useState(null);
  const { logout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log("🚀 ~ Home ~ user:", user);
  console.log(user?.user?._id);

  const fetchUser = () => {
    const url = `http://localhost:4000/api/user/singleUser/${user?.user?._id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchUser();
  }, [user?.user?._id]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed w-full py-3 bg-white z-10">
      <div className="md:w-3/4 w-11/12 mx-auto">
        <div className="flex justify-between items-center">
          <div className="w-40">
            <img src={logo} alt="Logo" />
          </div>
          <div
            className={`lg:flex lg:gap-10 md:gap-5 items-center ${
              isMenuOpen
                ? "flex flex-col border rounded-md absolute top-full left-0 w-full bg-white p-2"
                : "hidden"
            }`}
          >
            <Link to={"/"} className="font-semibold">
              Home
            </Link>
            {user?.user?.role === "admin" && (
              <Link to="/dashboard/admin/adminHome" className="font-semibold">
                Dashboard
              </Link>
            )}
            {user?.user?.role === "user" && (
              <Link to="/dashboard/user/userHome" className="font-semibold">
                Dashboard
              </Link>
            )}
            <Link to="/allCourses" className="font-semibold">
              Courses
            </Link>
          </div>
          <div className="flex items-center gap-2 flex-row-reverse">
            <div className="lg:hidden">
              <button onClick={toggleMenu} className="text-2xl">
                <HiMenu />
              </button>
            </div>
            {user ? (
              <div className="bg-[#125ca6] flex items-center gap-5 rounded-full">
                <p className="pl-4 text-white font-semibold hidden sm:block">
                  {userData?.firstname} {userData?.lastname}
                </p>
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar"
                  >
                    <div className="w-9 rounded-full border-2 border-white">
                      <img
                        className="w-9 h-9 object-top rounded-full object-cover"
                        alt="Profile Picture"
                        src={userData?.img}
                      />
                    </div>
                  </div>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-md border z-[1] mt-3 w-52 p-2 shadow"
                  >
                    <li>
                      <Link to={"/profile"}>
                        <CgProfile /> Profile
                      </Link>
                    </li>
                    <li>
                      <Link to={`/settings`}>
                        <IoSettingsOutline /> Settings
                      </Link>
                    </li>
                    <li onClick={logout}>
                      <Link>
                        <MdLogout /> Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 sm:gap-10 items-center font-semibold">
                <Link to={"/login"}>Login</Link>
                <Link
                  to={"/signup"}
                  className="bg-[#125ca6] text-white px-3 pt-1 pb-[0.4rem] rounded-md"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
