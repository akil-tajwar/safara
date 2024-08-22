import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useState } from "react";

const Login = () => {
  const navigate =useNavigate();
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
    <div className="hero mt-10">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-nsans-bold animate-pulse">Login now!</h1>
          <img src="/images/auth.png" alt="Login" />
        </div>

        <form onSubmit={handleSubmit} className="card-body w-full">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
            />
            <label className="label">
              <a href="#" className="label-text-alt link link-hover">
                Forgot password?
              </a>
            </label>
          </div>

          <div className="form-control mt-6">
            <button type="submit" className="btn btn-error text-3xl text-white">
              Login
            </button>
          </div>
          <p className="text-center">
            New here?{" "}
            <Link to="/signup" className="text-red-500 animate-pulse">
              Register
            </Link>{" "}
          </p>
          <div
            className="border border-white text-white rounded-lg flex items-center justify-center gap-3 font-bold  p-3 mt-10 bg-[#cb7728]  hover:shadow-xl hover:shadow-[#0ecb34]"
          >
            <box-icon
              name="google"
              type="logo"
              color="rgba(9,242,46,0.99)"
            ></box-icon>
            <span>Login With Google</span>
          </div>
          <Link to={"/"} className="mx-auto">
            <span>
              <FaHome className="text-5xl text-red-400 text-center" />
            </span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
