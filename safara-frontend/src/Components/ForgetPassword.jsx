import axios from "axios";
import { FaAngleLeft } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ForgetPassword = () => {
    const navigate = useNavigate();
    const baseUrl= import.meta.env.VITE_SAFARA_baseUrl;
    const handleSubmit = (e) => {
      e.preventDefault();
  
      const form = e.target;
  
      const email = form.email.value;
  
      axios
        .post(
          `${baseUrl}/api/user/forgetPassword`,
          { email },
          { withCredential: true }
        )
        .then((res) => { 
          
          Swal.fire({
              position: "top-middle",
              icon: "success",
              title: "Reset Email Sent!",
              showConfirmButton: true,
          });
          if (res.data.status) {
            console.log("successfully login");
          
            navigate("/login");
          }
        });
    };
    return (
        <div className="mt-20">
      <Link to={'/'} className="flex items-center gap-2 font-semibold w-3/4 mx-auto text-xl pb-10">
        <FaAngleLeft />
        <p>Go back to home</p>
      </Link>
      <h2 className="text-center text-4xl font-semibold text-primary pb-5">Forget Password</h2>
      <form onSubmit={handleSubmit} className="w-1/4 mx-auto border rounded-md p-10">
        <div className="form-control">
          <label className="">
            <span className="">Email</span>
          </label>
          <input
            type="email"
            name= "email"
            placeholder="Enter your email"
        
           
            className="input input-bordered focus:border-none rounded-md border hover:border-primary"
          />
        </div>
      

        <div className="form-control mt-6">
          <button type="submit" className="bg-primary py-3 rounded-md text-white">
          Send
          </button>
        </div>
        <p className="text-center pt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
        Login
          </Link>{" "}
        </p>
        <button className="border border-primary py-3 rounded-md w-full mt-4 flex items-center justify-center">
          <FcGoogle className="text-3xl mr-3" />
          <span>Login with Google</span>
        </button>
      </form>
    </div>
    );
};

export default ForgetPassword;