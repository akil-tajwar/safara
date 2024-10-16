import { IoIosNotifications } from "react-icons/io";
import useAuthContext from "../../../hooks/useAuthContext";
import { useLogout } from "../../../hooks/useLogout";

const DashNavbar = () => {
  const { user } = useAuthContext();

  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex justify-between relative  w-full h-16 items-center">
      <div className="navbar bg-gray-800 pt-4">
        <div className="flex-1">
          <a className="text-2xl font-bold  text-white">
            Welcome {user?.user?.firstname + "" + user?.user?.lastname}
          </a>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <IoIosNotifications className="text-3xl" />
            </div>
            <div
              tabIndex={0}
              className="card card-compact dropdown-content bg-base-100 z-[1] mt-3 w-52 shadow"
            >
              <div className="card-body">
                <span className="text-lg font-bold">8 Items</span>
                <span className="text-info">Subtotal: $999</span>
                <div className="card-actions">
                  <button className="btn btn-primary btn-block">
                    View cart
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src={user?.user?.img}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">New</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashNavbar;
