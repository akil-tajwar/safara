import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="fixed w-full py-7">
            <div className="w-3/4 mx-auto">
                <div className="flex justify-between items-center">
                    <div className="w-60">
                        <img src="logo.png" alt="" />
                    </div>
                    <div className="flex gap-10">
                        <Link>Home</Link>
                        <Link>Courses</Link>
                        <Link to={'/login'}>Login</Link>
                        <Link to={'/signup'} className="bg-[#125ca6] text-white px-3 py-1 rounded-md">Signup</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;