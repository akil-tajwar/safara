import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaAngleLeft } from "react-icons/fa6";
import { getAuth, signInWithPopup } from "firebase/auth";
import axios from "axios";
import app from "../firebase/firebase";
import { GoogleAuthProvider } from "firebase/auth";

const auth = getAuth(app);

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const provider = new GoogleAuthProvider();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      const response = await login(email, password);
      if (response) {
        console.log("Login successful:", response);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      // Firebase authentication
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Send user details to the backend
      const response = await axios.post(
        "http://localhost:4000/api/user/googleLogin",
        {
          email: user.email,
          firstname: user.displayName?.split(" ")[0] || "Unknown",
          lastname: user.displayName?.split(" ")[1] || "N/A",
          img: user.photoURL,
          phone: "N/A", // Placeholder value
          role: "user", // Default role
        }
      );
         
      console.log('response',response.data);
      const { newUser, userRes, token } = response.data;

      if (newUser) {
        console.log("New user registered:", userRes);
        alert("Welcome! Your account has been created.");
      } else {
        console.log("User logged in:", userRes);
        alert("Welcome back!");
      }

      // Save token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userRes));

      // Navigate to the dashboard or home
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error.message);
      alert("Google login failed. Please try again.");
    } finally {
      setLoading(false);
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
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
        <p className="text-center pt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#125ca6]">
            Sign up
          </Link>
        </p>
        <button
          onClick={handleGoogleLogin}
          className="border border-[#125ca6] py-3 rounded-md w-full mt-4 flex items-center justify-center"
          disabled={loading}
        >
          <FcGoogle className="text-3xl mr-3" />
          <span>{loading ? "Logging in with Google..." : "Login with Google"}</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
