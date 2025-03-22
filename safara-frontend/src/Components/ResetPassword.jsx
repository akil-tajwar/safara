import { FaAngleLeft } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import Swal from "sweetalert2";

const ResetPassword = () => {
    const navigate = useNavigate();
    const {token} = useParams();
    const baseUrl= import.meta.env.VITE_BASE_URL;
    const handleSubmit = (e) => {
      e.preventDefault();
      const form = e.target;
      const password = form.password.value;
      axios
        .post(
          `${baseUrl}/api/user/resetPassword/`+token,
          { password },
          { withCredential: true }
        )
        .then((res) => {
            console.log(res);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your Password Updated",
                showConfirmButton: false,
                timer: 1500
              });
          if (res.data.status) {

            console.log("successfully Updated Password");
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
        <h2 className="text-center text-4xl font-semibold text-primary pb-5">Reset Password</h2>
        <form onSubmit={handleSubmit} className="w-1/4 mx-auto border rounded-md p-10">
          <div className="form-control">
            <label className="">
              <span className="">Password</span>
            </label>
            <input
              type="password"
              name= "password"
              placeholder="Enter your password"
          
             
              className="input input-bordered focus:border-none rounded-md border hover:border-primary"
            />
          </div>
        
  
          <div className="form-control mt-6">
            <button type="submit" className="bg-primary py-3 rounded-md text-white">
             Reset
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

export default ResetPassword;