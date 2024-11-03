import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import Whatsapp from "../Components/Whatsapp";

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
    <div className="relative">
      {shouldRenderHeaderFooter && <div className="pb-[100px]"><Navbar /></div>}
      <div className="min-h-[79vh]">
        <Outlet />
      </div>
      <div className="">
        <Whatsapp />
      </div>
      {shouldRenderHeaderFooter && <Footer />}
    </div>
  );
}

export default Main;
