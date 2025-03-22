import axios from "axios";
import { useState } from "react";
import useAuthContext from "../hooks/useAuthContext";
import { useLogout } from "../hooks/useLogout";
const Settings = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // for success messages
  const [error, setError] = useState(""); // for error messages
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const id = user?.user?._id;

  const handleDeleteMyAccount = async (e) => {
    e.preventDefault();

    // Reset messages
    setMessage("");
    setError("");

    if (!password) {
      setError("Password is required.");
      return;
    }
    const baseUrl= import.meta.env.VITE_BASE_URL;
    try {
      // Send request to delete the account
      const response = await axios.delete(
        `${baseUrl}/api/user/deleteMyAccount`,
        {
          data: { password, id },
        }
      );

      setMessage(response.data.message || "Account deleted successfully.");
      // Optionally, log the user out and redirect
      localStorage.removeItem("token");
      logout();
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    const form = e.target;
    const oldPassword = form.oldPassword.value;
    const newPassword = form.newPassword.value;
    const retypePassword = form.retypePassword.value;

    console.log(oldPassword, newPassword, retypePassword, id);
    // Clear previous messages
    setMessage("");
    setError("");

    // Client-side validations
    if (!oldPassword || !newPassword || !retypePassword) {
      setError("All fields are required.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== retypePassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    const baseUrl= import.meta.env.VITE_BASE_URL;
    try {
      // Make API request
      const response = await axios.patch(
        `${baseUrl}/api/user/changePassword`,
        { oldPassword, newPassword, retypePassword, id }
      );

      // Handle successful response
      setMessage(response.data.message || "Password changed successfully!");
      form.reset(); // Clear the form fields
    } catch (err) {
      // Handle error response
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="w-3/4 mx-auto">
      <div>
        <h3 className="text-2xl pb-2">Security</h3>
        <div className="border p-4 rounded-lg flex justify-between items-center">
          <h5 className="text-lg">Password</h5>
          <button
            className="bg-primary py-2 px-5 w-44 rounded-md text-white"
            onClick={() =>
              document.getElementById("change-password-modal").showModal()
            }
          >
            Change Password
          </button>
          <dialog id="change-password-modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* Modal close button */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-semibold text-xl pb-3">Change Password</h3>

              {/* Display feedback */}
              {error && <p className="text-red-500 pb-3">{error}</p>}
              {message && <p className="text-green-500 pb-3">{message}</p>}

              <form onSubmit={handleChangePassword}>
                <div className="form-control">
                  <label>
                    <span>Old Password</span>
                  </label>
                  <input
                    type="password"
                    name="oldPassword"
                    placeholder="Enter your old password"
                    className="input input-bordered focus:border-none rounded-md border hover:border-primary"
                  />
                </div>
                <div className="form-control py-3">
                  <label>
                    <span>New Password</span>
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Enter your new password"
                    className="input input-bordered focus:border-none rounded-md border hover:border-primary"
                  />
                </div>
                <div className="form-control">
                  <label>
                    <span>Retype New Password</span>
                  </label>
                  <input
                    type="password"
                    name="retypePassword"
                    placeholder="Enter your new password"
                    className="input input-bordered focus:border-none rounded-md border hover:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary w-full mt-6 py-3 rounded-md text-white"
                >
                  Change Password
                </button>
              </form>
            </div>
          </dialog>
        </div>
      </div>

      <div className="pt-5">
        <h3 className="text-2xl pb-2">Danger Zone</h3>
        <div className="border border-error p-4 rounded-lg flex justify-between items-center">
          <h5 className="text-lg">Delete your account permanently</h5>
          <button
            className="text-white bg-error py-2 w-44 px-5 rounded-md"
            onClick={() =>
              document.getElementById("delete-account").showModal()
            }
          >
            Delete Account
          </button>
          <dialog id="delete-account" className="modal">
            <div className="modal-box">
              <form method="dialog">
                {/* Modal close button */}
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <form method="dialog" onSubmit={handleDeleteMyAccount}>
                <h3 className="font-semibold text-lg pb-3">
                  Delete your account
                </h3>
                <div className="form-control">
                  <input
                    type="password"
                    placeholder="Enter your password"
                    className="input input-bordered focus:border-none rounded-md border hover:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="text-white bg-error w-full mt-6 py-3 rounded-md"
                >
                  Delete Account
                </button>
                {error && (
                  <p className="text-error text-center mt-2">{error}</p>
                )}
                {message && (
                  <p className="text-success text-center mt-2">{message}</p>
                )}
                <p className="pt-4 text-error text-center font-semibold">
                  NB: You will lose all of your courses and certificates.
                </p>
              </form>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
};

export default Settings;
