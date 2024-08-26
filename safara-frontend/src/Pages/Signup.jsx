import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { FaAngleLeft } from "react-icons/fa6";

const Signup = () => {
    const { signup } = useSignup();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const { firstname, lastname, email, phone, role, password } = data;
        await signup(firstname, lastname, email, phone, role, password);
    };

    return (
        <div className="pt-10 pb-24">
            <Link to={'/'} className="flex items-center gap-2 font-semibold w-3/4 mx-auto text-xl pb-10">
                <FaAngleLeft />
                <p>Go back to home</p>
            </Link>
            <h2 className="text-center text-4xl font-semibold text-[#125ca6] pb-5">SIGNUP</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="w-1/4 mx-auto border rounded-md p-10">
                <div className="form-control pb-4">
                    <label className="">
                        <span className="">First Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your first name"
                        {...register("firstname", { required: true })}
                        className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                    />
                </div>
                <div className="form-control pb-4">
                    <label className="">
                        <span className="">Last Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your last name"
                        {...register("lastname", { required: true })}
                        className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                    />
                </div>
                <div className="form-control pb-4">
                    <label className="">
                        <span className="">Email</span>
                    </label>
                    <input
                        type="email"
                        placeholder="email"
                        {...register("email", { required: true })}
                        className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                    />
                </div>
                <div className="form-control pb-4">
                    <label className="">
                        <span className="">Phone</span>
                    </label>
                    <input
                        type="text"
                        placeholder="phone"
                        {...register("phone", { required: true })}
                        className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                    />
                </div>
                <div className="form-control pb-4">
                    <label className="">
                        <span className="">Signup as</span>
                    </label>
                    <select
                        name="role"
                        {...register("role", { required: true })}
                        className="focus:border-none rounded-md border hover:border-[#125ca6] p-3"
                    >
                        <option value="Teacher">Teacher</option>
                        <option value="Student">Student</option>
                    </select>
                </div>
                <div className="form-control pb-4">
                    <label className="">
                        <span className="">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="password"
                        {...register("password", { required: true })}
                        className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                    />
                </div>
                <div className="form-control w-full  mb-4">
                    <label>
                        <span>Upload your image</span>
                    </label>
                    <input type="file" {...register("image")} className="file-input w-full file-input-bordered" />
                </div>
                <div className="form-control mt-10">
                    <button type="submit" className="bg-[#125ca6] py-3 rounded-md text-white">
                        Signup
                    </button>
                </div>
                <p className="text-center pt-2">
                    Already have an account?{" "}
                    <Link to="/login" className="text-[#125ca6]">
                        Login
                    </Link>{" "}
                </p>
            </form>
        </div>
    );
};

export default Signup;
