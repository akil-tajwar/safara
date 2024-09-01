import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaAngleLeft } from "react-icons/fa6";

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    const response = await login(email, password);
    if (response) {
      console.log(response.message);
      navigate('/');
    }
  }

  return (
    <div className="mt-20">
      <Link to={'/'} className="flex items-center gap-2 font-semibold w-3/4 mx-auto text-xl pb-10">
        <FaAngleLeft />
        <p>Go back to home</p>
      </Link>
      <h2 className="text-center text-4xl font-semibold text-[#125ca6] pb-5">LOGIN</h2>
      <form onSubmit={handleSubmit} className="w-1/4 mx-auto border rounded-md p-10">
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
            <a href="#" className="">
              Forgot password?
            </a>
          </label>
        </div>

        <div className="form-control mt-6">
          <button type="submit" className="bg-[#125ca6] py-3 rounded-md text-white">
            Login
          </button>
        </div>
        <p className="text-center pt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-[#125ca6]">
            signup
          </Link>{" "}
        </p>
        <button className="border border-[#125ca6] py-3 rounded-md w-full mt-4 flex items-center justify-center">
          <FcGoogle className="text-3xl mr-3" />
          <span>Login with Google</span>
        </button>
      </form>
    </div>
  );
};

export default Login;
