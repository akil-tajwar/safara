import axios from "axios";
import { useState, useEffect } from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { storage } from "../../../firebase/firebase"; // Firebase import
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const UpdateProfile = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false); // Loader visibility
  const [uploadPerc, setUploadPerc] = useState(0); // Upload percentage
  const [selectedImage, setSelectedImage] = useState(null); // Handle image selection
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "Choose Gender",
    profession: [{ position: "", institution: "" }],
    degree: "",
    result: "",
    location: "",
    img: "",
  });

  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;

  // Fetch user data
  useEffect(() => {
    if (!user?.user?._id) return;

    axios
      .get(`${baseUrl}/api/user/singleUser/${user?.user?._id}`, {
        withCredentials: true,
      })
      .then((res) => setUserData(res.data))
      .catch((err) =>
        console.error("There was an error fetching the user data!", err)
      );
  }, [user?.user?._id]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target;

    const updatedData = {
      firstname: form.firstName.value || userData.firstname,
      lastname: form.lastName.value || userData.lastname,
      email: form.email.value || userData.email,
      phone: form.phone.value || userData.phone,
      birthday: form.birthday.value || userData.birthday,
      gender: form.gender.value || userData.gender,
      profession: [
        {
          position: form.position.value || userData.profession[0]?.position,
          institution:
            form.institution.value || userData.profession[0]?.institution,
        },
      ],
      degree: form.degree.value || userData.degree,
      result: form.result.value || userData.result,
      location: form.location.value || userData.location,
    };

    try {
      if (selectedImage) {
        const imgName = `${Date.now()}_${selectedImage.name}`;
        const storageRef = ref(storage, `images/${imgName}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

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
            updatedData.img = downloadURL;
            await axios.patch(
              `${baseUrl}/api/user/updateUser/${user?.user?._id}`,
              updatedData,
              { withCredentials: true }
            );
            setLoading(false);
            navigate("/profile");
          }
        );
      } else {
        await axios.patch(
          `${baseUrl}/api/user/updateUser/${user?.user?._id}`,
          updatedData,
          { withCredentials: true }
        );
        setLoading(false);
        navigate("/profile");
      }
    } catch (error) {
      console.error("There was an error updating the profile!", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Update Profile | Mahad LMS</title>
        <meta
          name="description"
          content="Update your personal, professional, and educational details in Mahad LMS."
        />
      </Helmet>

      <div className="md:w-3/4 w-11/12 mx-auto">
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <span
              className="loading loading-spinner w-40 h-40 text-white"
              aria-label="Updating profile..."
            ></span>
          </div>
        )}

        <p className="md:text-3xl border-b font-bold text-primary pb-2 mb-10">
          Update Profile
        </p>

        <form onSubmit={handleUpdate}>
          {/* PERSONAL INFO */}
          <p className="font-semibold text-xs text-slate-400 pb-1">
            PERSONAL INFO
          </p>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <div className="form-control w-full">
              <label className="label">First Name</label>
              <input
                type="text"
                name="firstName"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.firstname}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">Last Name</label>
              <input
                type="text"
                name="lastName"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.lastname}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">Birthday</label>
              <input
                type="date"
                name="birthday"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.birthday}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">Gender</label>
              <select
                name="gender"
                className="px-3 cursor-pointer py-[11px] rounded-md border border-slate-200"
                value={userData.gender || "Choose Gender"}
                onChange={(e) =>
                  setUserData({ ...userData, gender: e.target.value })
                }
              >
                <option value="Choose Gender">Choose Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Third Gender">Third Gender</option>
              </select>
            </div>
            <div className="form-control w-full">
              <label className="label">Photo</label>
              <input
                type="file"
                accept="image/*"
                className="file-input w-full border border-slate-200"
                onChange={handleImageChange}
              />
              {selectedImage && uploadPerc > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  {uploadPerc}% uploaded
                </p>
              )}
            </div>
          </div>

          {/* PROFESSIONAL INFO */}
          <p className="font-semibold text-xs text-slate-400 pb-1 pt-10">
            PROFESSIONAL INFO
          </p>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <div className="form-control w-full">
              <label className="label">Position</label>
              <input
                type="text"
                name="position"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.profession[0]?.position}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">Institution</label>
              <input
                type="text"
                name="institution"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.profession[0]?.institution}
              />
            </div>
          </div>

          {/* EDUCATION */}
          <p className="font-semibold text-xs text-slate-400 pb-1 pt-10">
            EDUCATIONAL HISTORY
          </p>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <div className="form-control w-full">
              <label className="label">Degree</label>
              <input
                type="text"
                name="degree"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.degree}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">Result</label>
              <input
                type="text"
                name="result"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.result}
              />
            </div>
          </div>

          {/* CONTACT */}
          <p className="font-semibold text-xs text-slate-400 pb-1 pt-10">
            CONTACT INFO
          </p>
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <div className="form-control w-full">
              <label className="label">Phone</label>
              <input
                type="text"
                name="phone"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.phone}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">Address</label>
              <input
                type="text"
                name="location"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.location}
              />
            </div>
            <div className="form-control w-full">
              <label className="label">Email</label>
              <input
                type="email"
                name="email"
                className="px-3 py-[11px] rounded-md border border-slate-200"
                defaultValue={userData.email}
              />
            </div>
          </div>

          <div className="py-10 text-center">
            <button
              type="submit"
              className="rounded-md py-[11px] px-4 bg-primary text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateProfile;
