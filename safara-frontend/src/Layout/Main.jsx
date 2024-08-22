import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Main() {
    const location = useLocation();
    const shouldRenderHeaderFooter = !["/login", "/signup"].includes(
        location.pathname
    );

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
