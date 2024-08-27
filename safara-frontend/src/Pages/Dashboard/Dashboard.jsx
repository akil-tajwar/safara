import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="fixed">
        <Sidebar />
      </div>
      <div className="p-8 ml-64 flex-1 text-black">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
