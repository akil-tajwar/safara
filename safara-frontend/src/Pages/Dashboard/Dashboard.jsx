import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import DashNavbar from "./UserDashboard/DashNavbar";

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="fixed">
        <Sidebar />
      </div>
      <div className="flex-1 lg:ml-64 ml-0 h-screen">
        <DashNavbar />
        <div className="p-4">
          {" "}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
