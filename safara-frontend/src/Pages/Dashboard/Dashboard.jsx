import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import DashNavbar from "./UserDashboard/DashNavbar";
import { Helmet } from "react-helmet";

const Dashboard = () => {
  return (
    <div className="flex">
      {/* Helmet sets the title + meta for SEO */}
      <Helmet>
        <title>Dashboard | Mahad LMS</title>
        <meta
          name="description"
          content="Access your Mahad LMS dashboard to manage courses, teachers, and learning activities."
        />
      </Helmet>

      <div className="relative">
        <Sidebar />
      </div>
      <div className="flex-1 lg:ml-64 h-screen">
        <DashNavbar />
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
