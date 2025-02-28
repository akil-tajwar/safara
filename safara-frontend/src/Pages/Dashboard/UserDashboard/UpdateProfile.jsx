import axios from "axios";
import { useState, useEffect } from "react";
import useAuthContext from "../../../hooks/useAuthContext";
import { storage } from '../../../firebase/firebase'; // Firebase import
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false); // State for loader visibility
  const [uploadPerc, setUploadPerc] = useState(0); // Upload percentage for image
  const [selectedImage, setSelectedImage] = useState(null); // State to handle image selection
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    birthday: "",
    gender: "",
    profession: [{ position: "", institution: "" }],
    degree: "",
    result: "",
    location: "",
    img: "",
  });

  // Fetch user data by ID
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/user/singleUser/${user?.user?._id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setUserData(response.data); // Populate form with fetched user data
      })
      .catch((error) => {
        console.error("There was an error fetching the user data!", error);
      });
  }, [user?.user?._id]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleProfessionChange = (index, field, value) => {
    const updatedProfession = [...userData.profession];
    updatedProfession[index][field] = value;
    setUserData({ ...userData, profession: updatedProfession });
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
          institution: form.institution.value || userData.profession[0]?.institution,
        },
      ],
      degree: form.degree.value || userData.degree,
      result: form.result.value || userData.result,
      location: form.location.value || userData.location,
    };

    try {
      // If an image is selected, upload to Firebase first
      if (selectedImage) {
        const imgName = `${new Date().getTime()}_${selectedImage.name}`;
        const storageRef = ref(storage, `images/${imgName}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        // Listen for state changes during upload
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadPerc(Math.round(progress));
          },
          (error) => {
            console.error("Error uploading image: ", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            updatedData.img = downloadURL; // Update image URL
            await axios.patch(
              `http://localhost:4000/api/user/updateUser/${user?.user?._id}`,
              updatedData,
              { withCredentials: true }
            );
            setLoading(false);
            navigate("/profile");
          }
        );
      } else {
        await axios.patch(
          `http://localhost:4000/api/user/updateUser/${user?.user?._id}`,
          updatedData,
          { withCredentials: true }
        );
        setLoading(false);
        navigate("/profile");
      }
    } catch (error) {
      console.error("There was an error updating the profile!", error);
    }
  };

  return (
    <div className="md:w-3/4 w-11/12 mx-auto">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <span className="loading loading-spinner w-40 h-40 text-white"></span>
        </div>
      )}
      <p className="md:text-3xl border-b font-bold text-primary pb-2 mb-10">Update Profile</p>
      <form onSubmit={handleUpdate} className="">
        <p className="font-semibold text-xs text-slate-400 pb-1">PERSONAL INFO</p>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              name="firstName"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.firstname}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              name="lastName"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.lastname}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Birthday</span>
            </label>
            <input
              type="date"
              name="birthday"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.birthday}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <select name="gender" className="px-3 cursor-pointer py-[11px] rounded-md border border-slate-200">
              <option value="Choose Gender" selected={userData.gender === "Choose Gender"}>
                Choose Gender
              </option>
              <option value="Male" selected={userData.gender === "Male"}>
                Male
              </option>
              <option value="Female" selected={userData.gender === "Female"}>
                Female
              </option>
              <option value="Third Gender" selected={userData.gender === "Third Gender"}>
                Third Gender
              </option>
            </select>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Photo</span>
            </label>
            <input type="file" accept="image/*" className="file-input w-full border border-slate-200" onChange={handleImageChange} />
            {/* <p>{uploadPerc}% uploaded</p> */}
          </div>
        </div>
        {/* Profession Section */}
        <p className="font-semibold text-xs text-slate-400 pb-1 pt-10">PROFESSIONAL INFO</p>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Position</span>
            </label>
            <input
              type="text"
              name="position"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.profession[0]?.position}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Institution</span>
            </label>
            <input
              type="text"
              name="institution"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.profession[0]?.institution}
            />
          </div>
        </div>
        {/* Educational History */}
        <p className="font-semibold text-xs text-slate-400 pb-1 pt-10">EDUCATIONAL HISTORY</p>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Degree</span>
            </label>
            <input
              type="text"
              name="degree"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.degree}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Result</span>
            </label>
            <input
              type="text"
              name="result"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.result}
            />
          </div>
        </div>
        {/* Contact Info */}
        <p className="font-semibold text-xs text-slate-400 pb-1 pt-10">CONTACT INFO</p>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              name="phone"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.phone}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              name="location"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.location}
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="text"
              name="email"
              className="px-3 py-[11px] rounded-md border border-slate-200"
              defaultValue={userData.email}
            />
          </div>
        </div>
        <div className="py-10 text-center">
          <button type="submit" className="rounded-md py-[11px] px-4 bg-primary text-white">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
