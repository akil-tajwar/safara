import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { FaAngleLeft } from "react-icons/fa6";
import { useState } from "react";
import { storage } from "../firebase/firebase"; // Use storage from the initialized firebase file
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DOMPurify from "dompurify"; // For sanitizing inputs

const Signup = () => {
  const { signup } = useSignup();
  const [uploadPerc, setUploadPerc] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [selectedImage, setSelectedImage] = useState(null);

  // Function to sanitize all inputs
  const sanitizeInput = (input) => {
    return DOMPurify.sanitize(input.trim());  // Trim and sanitize to remove any unwanted content
  };

  const onSubmit = async (data) => {
    // Sanitize all user inputs to prevent XSS attacks
    const { firstname, lastname, email, phone, password } = data;

    const sanitizedFirstname = sanitizeInput(firstname);
    const sanitizedLastname = sanitizeInput(lastname);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedPassword = sanitizeInput(password);
    const role = "user";
    const prevRole = role;

    try {
      // Validate if an image file is selected
      if (selectedImage) {
        // Image file validation (limit size, file type)
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(selectedImage.type)) {
          throw new Error("Invalid file type. Only JPG and PNG are allowed.");
        }

        const maxSize = 5 * 1024 * 1024; // Limit to 5MB
        if (selectedImage.size > maxSize) {
          throw new Error("File is too large. Maximum size is 5MB.");
        }

        const imgName = `${new Date().getTime()}_${selectedImage.name}`;
        const storageRef = ref(storage, `images/${imgName}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        // Listen for upload progress, errors, and completion
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadPerc(Math.round(progress));
          },
          (error) => {
            console.error("Error uploading image: ", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await signup(
              sanitizedFirstname,
              sanitizedLastname,
              sanitizedEmail,
              sanitizedPhone,
              role,
              prevRole,
              downloadURL,
              sanitizedPassword
            );
            console.log("Signup successful with image URL:", downloadURL);
          }
        );
      } else {
        // Proceed without image if none selected
        await signup(
          sanitizedFirstname,
          sanitizedLastname,
          sanitizedEmail,
          sanitizedPhone,
          role,
          prevRole,
          "",
          sanitizedPassword
        );
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

  const password = watch("password");
  const retypePassword = watch("retypePassword");

  return (
    <div className="pt-10 pb-24">
      <Link
        to={"/"}
        className="flex items-center gap-2 font-semibold lg:w-3/4 md:11/12 mx-auto text-xl pb-10"
      >
        <FaAngleLeft />
        <p>Go back to home</p>
      </Link>
      <h2 className="text-center text-4xl font-semibold text-[#125ca6] pb-5">
        SIGNUP
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:w-1/4 w-11/12 mx-auto border rounded-md p-10"
      >
        {/* Form Fields */}
        <div className="form-control pb-4">
          <label className="">First Name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            {...register("firstname", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-[#125ca6] focus:border-[#125ca6] rounded-md border hover:border-[#125ca6] transition-all"
          />
        </div>
        <div className="form-control pb-4">
          <label className="">Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            {...register("lastname", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-[#125ca6] focus:border-[#125ca6] rounded-md border hover:border-[#125ca6] transition-all"
          />
        </div>
        <div className="form-control pb-4">
          <label className="">Email</label>
          <input
            type="email"
            placeholder="email"
            {...register("email", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-[#125ca6] focus:border-[#125ca6] rounded-md border hover:border-[#125ca6] transition-all"
          />
        </div>
        <div className="form-control pb-4">
          <label className="">Phone</label>
          <input
            type="text"
            placeholder="phone"
            {...register("phone", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-[#125ca6] focus:border-[#125ca6] rounded-md border hover:border-[#125ca6] transition-all"
          />
        </div>
        {/* Image Upload Field */}
        <div className="form-control w-full mb-4">
          <div className="flex justify-between">
            <label><span>Upload your img</span></label>
            <p>{uploadPerc}%</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="file-input w-full file-input-bordered"
            onChange={handleImageChange}
          />
        </div>
        <div className="form-control pb-4">
          <label className="">Password</label>
          <input
            type="password"
            placeholder="password"
            {...register("password", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-[#125ca6] focus:border-[#125ca6] rounded-md border hover:border-[#125ca6] transition-all"
          />
        </div>
        <div className="form-control pb-4">
          <label className="">Retype Password</label>
          <input
            type="password"
            placeholder="Retype password"
            {...register("retypePassword", {
              required: true,
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="input input-bordered focus:ring-2 focus:ring-[#125ca6] focus:border-[#125ca6] rounded-md border hover:border-[#125ca6] transition-all"
          />
          {errors.retypePassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.retypePassword.message}
            </p>
          )}
        </div>
        <div className="form-control mt-10">
          <button type="submit" className="bg-[#125ca6] py-3 rounded-md text-white">
            Signup
          </button>
        </div>
        <p className="text-center pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#125ca6] hover:text-white hover:underline hover:bg-[#125ca6] px-1 py-0.5 rounded-md transition-all"
          >
            Login
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Signup;
