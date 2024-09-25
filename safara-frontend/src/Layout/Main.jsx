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
      {shouldRenderHeaderFooter && <div className="pb-[73px]"><Navbar /></div>}
      <div className="min-h-[79vh]">
        <Outlet />
      </div>
      {shouldRenderHeaderFooter && <Footer />}
    </div>
  );
}

export default Main;
