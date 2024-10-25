import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import DashNavbar from "./UserDashboard/DashNavbar";

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="fixed">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64  h-screen">
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
