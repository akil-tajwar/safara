import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { FcGoogle } from "react-icons/fc";
import { FaAngleLeft } from "react-icons/fa6";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase/firebase";

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = () => {
    const navigate = useNavigate();
    const { login, googleLogin, error: loginError, isLoading } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email || !password) {
            setError("Please fill in all required fields");
            return;
        }

        const userData = await login(email, password);
        if (userData) {
            if (userData.user.role === 'school-owner') {
                navigate('/dashboard');
            } else if (userData.user.role === 'teacher') {
                navigate('/teacherDashboard');
            } else {
                navigate('/');
            }
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError("");
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            if (!user.email) {
                throw new Error("Google login failed: Email is missing");
            }

            const randomPhone = Math.floor(Math.random() * 9000000000) + 1000000000;
            
            const userData = {
                firstname: user.displayName?.split(" ")[0] || "Unknown",
                lastname: user.displayName?.split(" ")[1] || "Unknown",
                email: user.email,
                phone: user.phoneNumber || randomPhone.toString(),
                role: "user",
                prevRole: "user",
                img: user.photoURL || "",
            };

            await googleLogin(userData);
        } catch (error) {
            console.error("Google login error:", error);
            setError(error.message || "Google login failed. Please try again.");
        }
    };

    return (
        <div className="mt-20">
            <Link
                to={"/"}
                className="flex items-center gap-2 font-semibold w-3/4 mx-auto text-xl pb-10"
            >
                <FaAngleLeft />
                <p>Go back to home</p>
            </Link>
            <h2 className="text-center text-4xl font-semibold text-[#125ca6] pb-5">
                LOGIN
            </h2>
            <form
                onSubmit={handleSubmit}
                className="w-1/4 mx-auto border rounded-md p-10"
            >
                {(error || loginError) && (
                    <p className="text-red-500 mb-4">{error || loginError}</p>
                )}
                <div className="form-control">
                    <label className="">
                        <span className="">Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                        required
                    />
                </div>
                <div className="form-control mt-4">
                    <label className="">
                        <span className="">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                        required
                    />
                    <label className="mt-4">
                        <Link to="/forgetPassword" className="">
                            Forgot password?
                        </Link>
                    </label>
                </div>

                <div className="form-control mt-6">
                    <button
                        type="submit"
                        className="bg-[#125ca6] py-3 rounded-md text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>
                </div>
                <p className="text-center pt-4">
                    Don&apos;t have an account?{" "}
                    <Link to="/signup" className="text-[#125ca6]">
                        Sign up
                    </Link>
                </p>
                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    className="border border-[#125ca6] py-3 rounded-md w-full mt-4 flex items-center justify-center"
                    disabled={isLoading}
                >
                    <FcGoogle className="text-3xl mr-3" />
                    <span>
                        {isLoading ? "Logging in with Google..." : "Login with Google"}
                    </span>
                </button>
            </form>
        </div>
    );
};

export default Login;

