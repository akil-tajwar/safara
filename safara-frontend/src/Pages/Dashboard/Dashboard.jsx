import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8 flex-1 text-black">
        <Outlet></Outlet>
      </div>
    </div>
  );
};

export default Dashboard;
