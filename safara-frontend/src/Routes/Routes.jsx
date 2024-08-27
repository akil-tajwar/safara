import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import AdminHome from "../Pages/Dashboard/AdminDashboard/AdminHome";
import AllUsers from "../Pages/Dashboard/AdminDashboard/AllUsers";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },

  //admin dashboard
  {
    path: "/dashboard/admin",
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard/admin/adminHome",
        element: <AdminHome />,
      },
      {
        path: "/dashboard/admin/allUsers",
        element: <AllUsers />,
      },
    ],
  },
]);
