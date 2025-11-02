import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import ErrorBoundary from "../utils/ErrorBoundary";
import LoadingSpinner from "../components/LoadingSpinner";

// ⚡ Non-lazy imports for instant initial load
import Main from "../Layout/Main";
import Home from "../Pages/Home";

// 🕓 Lazy imports (loaded only when needed)
const Signup = lazy(() => import("../Pages/Signup"));
const Login = lazy(() => import("../Pages/Login"));
const Dashboard = lazy(() => import("../Pages/Dashboard/Dashboard"));
const AdminHome = lazy(() =>
  import("../Pages/Dashboard/AdminDashboard/AdminHome")
);
const AllUsers = lazy(() =>
  import("../Pages/Dashboard/AdminDashboard/AllUsers")
);
const UserHome = lazy(() =>
  import("../Pages/Dashboard/UserDashboard/UserHome")
);
const AllCourses = lazy(() => import("../Components/AllCourses"));
const AddReview = lazy(() =>
  import("../Pages/Dashboard/UserDashboard/AddReview")
);
const PaymentHistory = lazy(() =>
  import("../Pages/Dashboard/UserDashboard/PaymentHistory")
);
const ForgetPassword = lazy(() => import("../Components/ForgetPassword"));
const ResetPassword = lazy(() => import("../Components/ResetPassword"));
const MyClasses = lazy(() =>
  import("../Pages/Dashboard/UserDashboard/MyClasses")
);
const ManageCourses = lazy(() =>
  import("../Pages/Dashboard/AdminDashboard/ManageCourses")
);
const AllTransactions = lazy(() =>
  import("../Pages/Dashboard/AdminDashboard/AllTransactions")
);
const AddCourses = lazy(() =>
  import("../Pages/Dashboard/AdminDashboard/AddCourses")
);
const SingleCourse = lazy(() => import("../Components/SingleCourse"));
const UpdateProfile = lazy(() =>
  import("../Pages/Dashboard/UserDashboard/UpdateProfile")
);
const Profile = lazy(() => import("../Pages/Profile"));
const Certificate = lazy(() => import("../Components/Certificate"));
const Settings = lazy(() => import("../Components/Settings"));
const ScheduleMeet = lazy(() => import("../Components/ScheduleMeet"));
const UpdateCourse = lazy(() =>
  import("../Pages/Dashboard/AdminDashboard/UpdateCourse")
);
const Others = lazy(() => import("../Pages/ManageOtherCard"));
const OtherProjectUpload = lazy(() =>
  import("../Pages/Dashboard/AdminDashboard/UploadOtherProject")
);
const ErrorPage = lazy(() => import("../Pages/ErrorPage"));

// 💡 Helper to wrap lazy-loaded components safely
const Lazy = (Component) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

// 🌐 Router Configuration
export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <Main />, // ⚡ Non-lazy for fast first paint
    errorElement: Lazy(ErrorPage),
    children: [
      { path: "/", element: <Home /> }, // ⚡ Home loads instantly (no spinner)
      { path: "/signup", element: Lazy(Signup) },
      { path: "/login", element: Lazy(Login) },
      { path: "/others", element: Lazy(Others) },
      { path: "/forgetPassword", element: Lazy(ForgetPassword) },
      { path: "/resetPassword/:token", element: Lazy(ResetPassword) },
      { path: "/allCourses", element: Lazy(AllCourses) },
      { path: "/singleCourse/:id", element: Lazy(SingleCourse) },
      { path: "/profile", element: Lazy(Profile) },
      { path: "/settings", element: Lazy(Settings) },
      { path: "/certificate", element: Lazy(Certificate) },
      { path: "/updateProfile", element: Lazy(UpdateProfile) },
    ],
  },

  // Admin Dashboard Routes
  {
    path: "/dashboard/admin",
    element: Lazy(Dashboard),
    errorElement: Lazy(ErrorPage),
    children: [
      { path: "/dashboard/admin/adminHome", element: Lazy(AdminHome) },
      { path: "/dashboard/admin/addCourses", element: Lazy(AddCourses) },
      { path: "/dashboard/admin/manageCourses", element: Lazy(ManageCourses) },
      {
        path: "/dashboard/admin/updateCourse/:id",
        element: Lazy(UpdateCourse),
      },
      { path: "/dashboard/admin/schedulemeet", element: Lazy(ScheduleMeet) },
      {
        path: "/dashboard/admin/transactionHistory",
        element: Lazy(AllTransactions),
      },
      { path: "/dashboard/admin/allUsers", element: Lazy(AllUsers) },
      {
        path: "/dashboard/admin/otherProjectUpload",
        element: Lazy(OtherProjectUpload),
      },
    ],
  },

  // User Dashboard Routes
  {
    path: "/dashboard/user",
    element: Lazy(Dashboard),
    errorElement: Lazy(ErrorPage),
    children: [
      { path: "/dashboard/user/userHome", element: Lazy(UserHome) },
      {
        path: "/dashboard/user/userPaymentHistory",
        element: Lazy(PaymentHistory),
      },
      { path: "/dashboard/user/userCourses", element: Lazy(MyClasses) },
      { path: "/dashboard/user/userReview", element: Lazy(AddReview) },
      { path: "/dashboard/user/userCertificate", element: Lazy(Certificate) },
    ],
  },
]);
