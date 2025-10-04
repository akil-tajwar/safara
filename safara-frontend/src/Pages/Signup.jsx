import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { FaAngleLeft } from "react-icons/fa6";
import { useState } from "react";
import { storage } from "../firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import DOMPurify from "dompurify";
import { Helmet } from "react-helmet"; // <-- Import Helmet

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

  const sanitizeInput = (input) => DOMPurify.sanitize(input.trim());

  const onSubmit = async (data) => {
    const { firstname, lastname, email, phone, password } = data;

    const sanitizedFirstname = sanitizeInput(firstname);
    const sanitizedLastname = sanitizeInput(lastname);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPhone = sanitizeInput(phone);
    const sanitizedPassword = sanitizeInput(password);
    const role = "admin";
    const prevRole = role;

    try {
      if (selectedImage) {
        const allowedTypes = ["image/jpeg", "image/png"];
        if (!allowedTypes.includes(selectedImage.type)) {
          throw new Error("Invalid file type. Only JPG and PNG are allowed.");
        }

        const maxSize = 5 * 1024 * 1024;
        if (selectedImage.size > maxSize) {
          throw new Error("File is too large. Maximum size is 5MB.");
        }

        const imgName = `${new Date().getTime()}_${selectedImage.name}`;
        const storageRef = ref(storage, `images/${imgName}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadPerc(Math.round(progress));
          },
          (error) => console.error("Error uploading image: ", error),
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
      {/* Helmet for page title and meta */}
      <Helmet>
        <title>Signup | Safara Learning Center</title>
        <meta
          name="description"
          content="Create your account at Safara Learning Center. Join our LMS platform to access top-rated courses."
        />
      </Helmet>

      <Link
        to={"/"}
        className="flex items-center gap-2 font-semibold lg:w-3/4 md:11/12 mx-auto text-xl pb-10"
      >
        <FaAngleLeft />
        <p>Go back to home</p>
      </Link>
      <h2 className="text-center text-4xl font-semibold text-primary pb-5">
        SIGNUP
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:w-1/4 w-11/12 mx-auto border rounded-md p-10"
      >
        {/* First Name */}
        <div className="form-control pb-4">
          <label>First Name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            {...register("firstname", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-primary focus:border-primary rounded-md border hover:border-primary transition-all"
          />
        </div>
        {/* Last Name */}
        <div className="form-control pb-4">
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            {...register("lastname", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-primary focus:border-primary rounded-md border hover:border-primary transition-all"
          />
        </div>
        {/* Email */}
        <div className="form-control pb-4">
          <label>Email</label>
          <input
            type="email"
            placeholder="email"
            {...register("email", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-primary focus:border-primary rounded-md border hover:border-primary transition-all"
          />
        </div>
        {/* Phone */}
        <div className="form-control pb-4">
          <label>Phone</label>
          <input
            type="text"
            placeholder="phone"
            {...register("phone", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-primary focus:border-primary rounded-md border hover:border-primary transition-all"
          />
        </div>
        {/* Image Upload */}
        <div className="form-control w-full mb-4">
          <div className="flex justify-between">
            <label>Upload your img</label>
            <p>{uploadPerc}%</p>
          </div>
          <input
            type="file"
            accept="image/*"
            className="file-input w-full file-input-bordered"
            onChange={handleImageChange}
          />
        </div>
        {/* Password */}
        <div className="form-control pb-4">
          <label>Password</label>
          <input
            type="password"
            placeholder="password"
            {...register("password", { required: true })}
            className="input input-bordered focus:ring-2 focus:ring-primary focus:border-primary rounded-md border hover:border-primary transition-all"
          />
        </div>
        {/* Retype Password */}
        <div className="form-control pb-4">
          <label>Retype Password</label>
          <input
            type="password"
            placeholder="Retype password"
            {...register("retypePassword", {
              required: true,
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
            className="input input-bordered focus:ring-2 focus:ring-primary focus:border-primary rounded-md border hover:border-primary transition-all"
          />
          {errors.retypePassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.retypePassword.message}
            </p>
          )}
        </div>
        <div className="form-control mt-10">
          <button
            type="submit"
            className="bg-primary py-3 rounded-md text-white"
          >
            Signup
          </button>
        </div>
        <p className="text-center pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-white hover:underline hover:bg-primary px-1 py-0.5 rounded-md transition-all"
          >
            Login
          </Link>{" "}
        </p>
      </form>
    </div>
  );
};

export default Signup;
