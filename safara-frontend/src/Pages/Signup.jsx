import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { FaAngleLeft } from "react-icons/fa6";
import { useState } from "react";
import { storage } from '../firebase/firebase'; // Use storage from the initialized firebase file
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const Signup = () => {
    const { signup } = useSignup();
    const [uploadPerc, setUploadPerc] = useState(0);
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch, // Added for validation
    } = useForm();

    const [selectedImage, setSelectedImage] = useState(null);

    const onSubmit = async (data) => {
        const { firstname, lastname, email, phone, password } = data;
        const role = "user";
        const prevRole = role;

        try {
            // Check if an image file is selected
            if (selectedImage) {
                const imgName = `${new Date().getTime()}_${selectedImage.name}`;
                const storageRef = ref(storage, `images/${imgName}`);
                const uploadTask = uploadBytesResumable(storageRef, selectedImage);

                // Listen for state changes, errors, and completion of the upload
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Calculate and set upload progress
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        setUploadPerc(Math.round(progress));
                    },
                    (error) => {
                        console.error("Error uploading image: ", error);
                    },
                    async () => {
                        // Get the download URL once upload is complete
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                        // Call signup function with all data including image URL
                        await signup(firstname, lastname, email, phone, role, prevRole, downloadURL, password);

                        console.log("Signup successful with image URL:", downloadURL);
                    }
                );
            } else {
                // If no image is selected, proceed without image URL
                await signup(firstname, lastname, email, phone, role, prevRole, "", password);
                console.log("Signup successful without image.");
            }
        } catch (error) {
            console.error("Error in signup: ", error);
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImage(e.target.files[0]);
        }
    };

    // Watch password and retypePassword fields
    const password = watch("password");
    const retypePassword = watch("retypePassword");

    return (
        <div className="pt-10 pb-24">
            <Link to={'/'} className="flex items-center gap-2 font-semibold w-3/4 mx-auto text-xl pb-10">
                <FaAngleLeft />
                <p>Go back to home</p>
            </Link>
            <h2 className="text-center text-4xl font-semibold text-[#125ca6] pb-5">SIGNUP</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="w-1/4 mx-auto border rounded-md p-10">
                {/* Form Fields */}
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
                {/* Image Upload Field */}
                <div className="form-control w-full mb-4">
                    <label>
                        <span>Upload your img</span>
                    </label>
                    <p>{uploadPerc}%</p>
                    <input
                        type="file"
                        accept="image/*"
                        className="file-input w-full file-input-bordered"
                        onChange={handleImageChange}
                    />
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
                <div className="form-control pb-4">
                    <label className="">
                        <span className="">Retype Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="Retype password"
                        {...register("retypePassword", {
                            required: true,
                            validate: (value) => value === password || "Passwords do not match",
                        })}
                        className="input input-bordered focus:border-none rounded-md border hover:border-[#125ca6]"
                    />
                    {errors.retypePassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.retypePassword.message}</p>
                    )}
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
