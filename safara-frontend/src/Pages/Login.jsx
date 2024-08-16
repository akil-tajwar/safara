import { useForm } from "react-hook-form";
import { FaHome } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";
const Login = () => {
    const { logIn, passwordReset ,googleLogin} = useAuth();

    const navigate = useNavigate();
    const location = useLocation()
    console.log(location)
  
    const {
      register,
      handleSubmit,
      getValues,
      formState: { errors },
    } = useForm();
    const onSubmit = (data) => {
      const email = data.email;
      const password = data.password;
  
      logIn(email, password).then((res) => {
        console.log(res);
        Swal.fire({
          position: "top-middle",
          icon: "success",
          title: `You are logged`,
          showConfirmButton: false,
          timer: 1000,
        });
        navigate(location?.state , {replace:true});
      });
    };
  
    const handleForgetPassword = () => {
      const email = getValues("email");
  
      passwordReset(email);
  
      console.log(email);
    };
    const handleGoogleLogin = () => {
        googleLogin()
          .then((result) => {
            navigate("/");
            console.log(result.user);
            const userInfo = {
              email: result.user?.email,
              name: result.user?.displayName,
              // photo: result.user?.photoURL,
            };
            useAxiosPublic.post("/users", userInfo).then((res) => {
              if (res.data.insertedId) {
                Swal.fire({
                  position: "top-middle",
                  icon: "success",
                  title: "You logged successfully",
                  showConfirmButton: false,
                  timer: 1000,
                });
                navigate("/");
              }
              console.log(res.data);
            });
          })
          .catch((error) => {
            console.log(error.message);
          });
      };
    
    return (
        <div className="hero mt-10">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-nsans-bold animate-pulse">Login now!</h1>
            <img src="/images/auth.png" alt="" />
          </div>
  
          <form onSubmit={handleSubmit(onSubmit)} className="card-body w-full">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                // ref={emailRef}
                placeholder="email"
                {...register("email", { required: true })}
                className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
              />
              {errors.email?.type === "required" && (
                <p className="text-red-500" role="alert">
                  Email is required
                </p>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                {...register("password", { required: true })}
                className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500" role="alert">
                  Password is required
                </p>
              )}
              <label className="label">
                <a
                  onClick={handleForgetPassword}
                  className="label-text-alt link link-hover"
                >
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
              New to here ?{" "}
              <Link to="/signup" className="text-red-500 animate-pulse">
                Register
              </Link>{" "}
            </p>
            <div
            onClick={handleGoogleLogin}
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
                {" "}
                <FaHome className="text-5xl text-red-400 text-center" />
              </span>
            </Link>
          </form>
        </div>
      </div>
    );
};

export default Login;