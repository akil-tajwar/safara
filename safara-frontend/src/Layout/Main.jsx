import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

function Main() {
    const location = useLocation();
    const shouldRenderHeaderFooter = !["/login", "/signUp"].includes(
        location.pathname
    );

    return (
        <div className="">
            {shouldRenderHeaderFooter && <Navbar />}
            <div className="min-h-[75vh]">
                <Outlet />
            </div>
            {shouldRenderHeaderFooter && <Footer />}
        </div>
    );
}

export default Main;
