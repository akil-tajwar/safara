import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";

const Signup = () => {
    const { signup, error } = useSignup();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { firstname, lastname, email, phone, role, password } = data;

        await signup(firstname, lastname, email, phone, role, password);

        if (!error) {
            Swal.fire({
                position: "top-middle",
                icon: "success",
                title: "Your account has been created",
                showConfirmButton: false,
                timer: 1500,
            });
        } else {
            Swal.fire({
                position: "top-middle",
                icon: "error",
                title: error,
                showConfirmButton: true,
            });
        }
    };

    return (
        <div className="hero pt-10">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-nsans-bold animate-pulse ">
                        Register now!
                    </h1>
                    <img src="/images/auth.png" alt="" />
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="card-body w-full">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">First Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your first name"
                            {...register("firstname", { required: true })}
                            className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
                        />
                        {errors.firstname && (
                            <p className="text-red-500" role="alert">
                                First Name is required
                            </p>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Last Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your last name"
                            {...register("lastname", { required: true })}
                            className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
                        />
                        {errors.lastname && (
                            <p className="text-red-500" role="alert">
                                Last Name is required
                            </p>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="email"
                            placeholder="email"
                            {...register("email", { required: true })}
                            className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
                        />
                        {errors.email && (
                            <p className="text-red-500" role="alert">
                                Email is required
                            </p>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Phone</span>
                        </label>
                        <input
                            type="text"
                            placeholder="phone"
                            {...register("phone", { required: true })}
                            className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
                        />
                        {errors.phone && (
                            <p className="text-red-500" role="alert">
                                Phone is required
                            </p>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Role</span>
                        </label>
                        <select
                            name="role"
                            {...register("role", { required: true })}
                            className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
                        >
                            <option value="Teacher">Teacher</option>
                            <option value="Student">Student</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-500" role="alert">
                                Role is required
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
                        {errors.password && (
                            <p className="text-red-500" role="alert">
                                Password is required
                            </p>
                        )}
                        <label className="label">
                            <a href="#" className="label-text-alt link link-hover">
                                Forgot password?
                            </a>
                        </label>
                    </div>
                    <div className="form-control">
                        <p className="my-2">Upload Your Image</p>
                        <input
                            type="file"
                            {...register("image")}
                            className="focus:border-none rounded-none "
                        />
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-error text-3xl text-white">
                            Signup
                        </button>
                    </div>
                    <p className="text-center">
                        New to here?{" "}
                        <Link to="/login" className="text-red-500 animate-pulse">
                            Login
                        </Link>{" "}
                    </p>
                    <div
                        className="border border-white text-white rounded-lg flex items-center justify-center gap-3 font-bold  p-3 mt-10 bg-[#cb7728] hover:shadow-xl hover:shadow-[#0ecb34]"
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

export default Signup;
