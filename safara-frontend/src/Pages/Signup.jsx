import { sendEmailVerification } from "firebase/auth";
import Swal from "sweetalert2";
import useAxiosPublic from "../hooks/useAxiosPublic";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaHome } from "react-icons/fa";
import { Link } from "react-router-dom";

const Signup = () => {
    const navigate = useNavigate();
    const { createUser, updateUser, googleLogin } = useAuth();
    const axiosPublic = useAxiosPublic();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const onSubmit = async (data) => {
        // const imgFile = { image: data.image[0] };
        // send image to imgbb

        // const res = await axios.post(image_api, imgFile, {
        //     headers: {
        //         "Content-Type": "multipart/form-data",
        //     },
        // });

        // console.log(res.data.data.display_url);

        const firstname = data.firstname;
        const lastname = data.lastname;
        const email = data.email;
        const phone = data.phone;
        const role = data.role;
        const password = data.password;
        // const image = res.data.data.display_url;

        const userInfo = { firstname, lastname, email, phone, role, password };

        createUser(email, password).then((res) => {
            updateUser(firstname, lastname);
            sendEmailVerification(res.user);

            axiosPublic.post("http://localhost:4000/api/user/signup", userInfo).then((res) => {
                if (res.data.insertedId) {
                    Swal.fire({
                        position: "top-middle",
                        icon: "success",
                        title: "Your account has been created",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    navigate("/");
                }
            });
        });
    };
    const handleGoogleLogin = () => {
        googleLogin()
            .then((result) => {
                navigate("/");
                console.log(result.user);
                const userInfo = {
                    name: result.user?.displayName,
                    email: result.user?.email,
                    // photo: result.user?.photoURL,
                };
                axiosPublic.post("http://localhost:4000/api/user/signup", userInfo).then((res) => {
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
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Your Name"
                            {...register("firstname", { required: true })}
                            className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
                        />
                        {errors.firstname?.type === "required" && (
                            <p className="text-red-500" role="alert">
                                Email is required
                            </p>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter Your Name"
                            {...register("lastname", { required: true })}
                            className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
                        />
                        {errors.name?.type === "required" && (
                            <p className="text-red-500" role="alert">
                                Email is required
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
                        {errors.email?.type === "required" && (
                            <p className="text-red-500" role="alert">
                                Email is required
                            </p>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="text"
                            placeholder="phone"
                            {...register("phone", { required: true })}
                            className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
                        />
                        {errors.phone?.type === "required" && (
                            <p className="text-red-500" role="alert">
                                phone is required
                            </p>
                        )}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input
                            type="text"
                            placeholder="role"
                            {...register("role", { required: true })}
                            className="input input-bordered focus:border-none rounded-none border hover:border-red-500"
                        />
                        {errors.role?.type === "required" && (
                            <p className="text-red-500" role="alert">
                                role is required
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
                            <a href="#" className="label-text-alt link link-hover">
                                Forgot password?
                            </a>
                        </label>
                    </div>
                    <div className="form-control ">
                        <p className="my-2">Upload Your Image</p>
                        <input
                            type="file"
                            {...register("image")}
                            className="focus:border-none rounded-none "
                        />
                        {errors.image?.type === "required" && (
                            <p className="text-red-500" role="alert">
                                Image is required
                            </p>
                        )}
                    </div>

                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-error text-3xl text-white">
                            Login
                        </button>
                    </div>
                    <p className="text-center">
                        New to here ?{" "}
                        <Link to="/login" className="text-red-500 animate-pulse">
                            Login
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

export default Signup;
