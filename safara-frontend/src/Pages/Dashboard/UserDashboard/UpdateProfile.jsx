import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const UpdateProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    identity: "",
    institution: "",
    profession: "",
    result: "",
  });

  // Fetch user data by id
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/user/singleUser/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setUserData(response.data); // Assuming response.data contains the user info
      })
      .catch((error) => {
        console.error("There was an error fetching the user data!", error);
      });
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedData = {
      firstname: form.firstName.value,
      lastname: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      identity: form.identity.value,
      institution: form.institution.value,
      profession: form.profession.value,
      result: form.result.value,
    };

    axios
      .patch(`http://localhost:4000/api/user/updateUser/${id}`, updatedData, {
        withCredentials: true,
      })
      .then(() => {
        alert("Profile updated successfully");
      })
      .catch((error) => {
        console.error("There was an error updating the profile!", error);
      });
  };

  return (
    <div>
      <p className="md:text-4xl font-bold text-[#125ca6]">Update Profile</p>
      <div className="divider"></div>

      <form onSubmit={handleUpdate} className="card-body">
        <div className="md:flex justify-around">
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
              defaultValue={userData.firstname}
            />
          </div>
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              type="text"
              name="lastName" // Corrected the name to "lastName"
              placeholder="Last Name"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
              defaultValue={userData.lastname}
            />
          </div>
        </div>

        <div className="md:flex justify-around">
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
              defaultValue={userData.email}
            />
          </div>
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Phone</span>
            </label>
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
              defaultValue={userData.phone}
            />
          </div>
        </div>

        <div className="md:flex justify-around">
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Identity</span>
            </label>
            <input
              type="text"
              name="identity"
              placeholder="Identity"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
              defaultValue={userData.identity}
            />
          </div>
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Institution</span>
            </label>
            <input
              type="text"
              name="institution"
              placeholder="Institution"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
              defaultValue={userData.institution}
            />
          </div>
        </div>

        <div className="md:flex justify-around">
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Profession</span>
            </label>
            <input
              type="text"
              name="profession"
              placeholder="Profession"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
              defaultValue={userData.profession}
            />
          </div>
          <div className="form-control md:w-1/3">
            <label className="label">
              <span className="label-text">Result</span>
            </label>
            <input
              type="text"
              name="result"
              placeholder="Result"
              className="input input-bordered rounded-none hover:border-blue-400"
              required
              defaultValue={userData.result}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-4">
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
