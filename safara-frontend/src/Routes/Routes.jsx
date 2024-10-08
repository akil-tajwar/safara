import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main";
import Home from "../Pages/Home";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import AdminHome from "../Pages/Dashboard/AdminDashboard/AdminHome";
import AllUsers from "../Pages/Dashboard/AdminDashboard/AllUsers";
import UserHome from "../Pages/Dashboard/UserDashboard/UserHome";
import AllCourses from "../Components/AllCourses";

import AddReview from "../Pages/Dashboard/UserDashboard/AddReview";
import PaymentHistory from "../Pages/Dashboard/UserDashboard/PaymentHistory";
import ForgetPassword from "../Components/ForgetPassword";
import ResetPassword from "../Components/ResetPassword";
import MyClasses from "../Pages/Dashboard/UserDashboard/MyClasses";
import ManageCourses from "../Pages/Dashboard/AdminDashboard/ManageCourses";
import ManageCourseBooking from "../Pages/Dashboard/AdminDashboard/ManageCourseBooking";
import AddCourses from "../Pages/Dashboard/AdminDashboard/AddCourses";
import SingleCourse from "../Components/SingleCourse";
import UpdateProfile from "../Pages/Dashboard/UserDashboard/UpdateProfile";
import Profile from "../Pages/Profile";
import Certificate from "../Components/certificate";

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
      {
        path: "/forgetPassword",
        element: <ForgetPassword/>,
      },
      {
        path: "/resetPassword/:token",
        element: <ResetPassword/>,
      },
      {
        path: "/AllCourses",
        element: <AllCourses/>,
      },
      {
        path: "/singleCourse/:id",
        element: <SingleCourse/>,
      }, 
      {
        path: "/profile",
        element: <Profile/>,
      }, 
      {
        path: "/certificate",
        element: <Certificate/>,
      }, 
      {
        path: "/updateProfile",
        element: <UpdateProfile />,
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
        path: "/dashboard/admin/addCourses",
        element: <AddCourses/>,
      },
      {
        path: "/dashboard/admin/manageCourses",
        element: <ManageCourses/>,
      },
      {
        path: "/dashboard/admin/manageBookings",
        element: <ManageCourseBooking/>,
      },
      {
        path: "/dashboard/admin/allUsers",
        element: <AllUsers />,
      },
    ],
  },
  
  //user dashboard
  {
    path: "/dashboard/user",
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard/user/userHome",
        element: <UserHome />,
      },
    
      {
        path: "/dashboard/user/userPaymentHistory",
        element: <PaymentHistory/>,
      },
      {
        path: "/dashboard/user/userCourses",
        element: <MyClasses />,
      },
      {
        path: "/dashboard/user/userReview",
        element: <AddReview />,
      },
      {
        path: "/dashboard/user/userCertificate",
        element: <Certificate />,
      },
    ],
  },
]);
