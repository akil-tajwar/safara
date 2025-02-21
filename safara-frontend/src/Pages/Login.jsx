import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { FcGoogle } from "react-icons/fc";
import { FaAngleLeft } from "react-icons/fa6";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../firebase/firebase";
import DOMPurify from "dompurify";

// Initialize Firebase Authentication
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin, error: loginError, isLoading } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Helper function to sanitize email and password inputs
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim());  // Trimming and sanitizing input
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Sanitize email and password
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!sanitizedEmail || !sanitizedPassword) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const userData = await login(sanitizedEmail, sanitizedPassword);
      if (userData) {
        if (userData.user.role === "school-owner") {
          navigate("/dashboard");
        } else if (userData.user.role === "teacher") {
          navigate("/teacherDashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(DOMPurify.sanitize(err.message || "Login failed. Please try again."));
    }
  };

  // Handle Google Login
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
      setError(DOMPurify.sanitize(error.message || "Google login failed. Please try again."));
    }
  };

  return (
    <div className="mt-20">
      <Link to={"/"} className="flex items-center gap-2 font-semibold lg:w-3/4 md:11/12 mx-auto text-xl pb-10">
        <FaAngleLeft />
        <p>Go back to home</p>
      </Link>
      <h2 className="text-center text-4xl font-semibold text-[#125ca6] pb-5">LOGIN</h2>
      <form onSubmit={handleSubmit} className="md:w-1/4 w-11/12 mx-auto border rounded-md p-10">
        {(error || loginError) && (
          <p
            className="text-red-500 mb-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(error || loginError),  // Sanitizing the error message
            }}
          />
        )}
        <div className="form-control">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered focus:ring-2 focus:ring-[#125ca6] focus:border-[#125ca6] rounded-md border hover:border-[#125ca6] transition-all"
            required
          />
        </div>
        <div className="form-control mt-4">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered focus:ring-2 focus:ring-[#125ca6] focus:border-[#125ca6] rounded-md border hover:border-[#125ca6] transition-all"
            required
          />
          <label className="mt-4">
            <Link to="/forgetPassword">Forgot password?</Link>
          </label>
        </div>

        <div className="form-control mt-6">
          <button
            type="submit"
            className="bg-[#125ca6] py-3 rounded-md text-white transition-all hover:bg-[#0a4a6f] hover:border-[#0a4a6f] border-2"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </div>
        <p className="text-center pt-4">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-[#125ca6] transition-all hover:text-[#0a4a6f] hover:underline"
          >
            Sign up
          </Link>
        </p>
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="border border-[#125ca6] py-3 rounded-md w-full mt-4 flex items-center justify-center transition-all hover:bg-[#0a4a6f] hover:border-[#0a4a6f] hover:text-white"
          disabled={isLoading}
        >
          <FcGoogle className="text-3xl mr-3" />
          <span>{isLoading ? "Logging in with Google..." : "Login with Google"}</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
