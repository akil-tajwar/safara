import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Main() {
  const location = useLocation();

  // Regular expression to match the singleCourse/:id route
  const singleCourseRegex = /^\/singleCourse\/[^/]+$/;

  const shouldRenderHeaderFooter = ![
    "/login",
    "/dashboard",
    "/signup",
  ].includes(location.pathname) && !singleCourseRegex.test(location.pathname);

  return (
    <div className="">
      {shouldRenderHeaderFooter && <Navbar />}
      <div className="min-h-[79vh] pt-32">
        <Outlet />
      </div>
      {shouldRenderHeaderFooter && <Footer />}
    </div>
  );
}

export default Main;
