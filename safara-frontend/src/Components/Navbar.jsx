import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="w-3/4 mx-auto">
            <div className="flex justify-between items-center">
                <div className="text-3xl">
                    logo
                </div>
                <div className="flex gap-10">
                    <Link>Home</Link>
                    <Link>Courses</Link>
                    <Link>Login</Link>
                    <Link>Signup</Link>
                </div>
            </div>
        </div>
    );
};

export default Navbar;