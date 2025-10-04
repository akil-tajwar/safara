import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUserMinus,
  FaUserShield,
} from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet"; // ✅ Import Helmet

const AllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 15;
  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;

  const fetchAllUsers = () => {
    const url = `${baseUrl}/api/user/allUsers`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAllUsers(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  // Delete user
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#125ca6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${baseUrl}/api/user/deleteUser/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "The user has been deleted.",
              icon: "success",
              confirmButtonColor: "#125ca6",
            });
            fetchAllUsers();
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "There was an error deleting the user.",
              icon: "error",
              confirmButtonColor: "#125ca6",
            });
          });
      }
    });
  };

  // Make admin
  const handleMakeAdmin = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#125ca6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, do it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${baseUrl}/api/user/makeAdmin/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: "admin" }),
        })
          .then((res) => res.json())
          .then((data) => {
            Swal.fire({
              title: "Done!",
              text: `${data.firstname} ${data.lastname} is an admin now`,
              icon: "success",
              confirmButtonColor: "#125ca6",
            });
            setAllUsers((prevUsers) =>
              prevUsers.map((user) =>
                user._id === id ? { ...user, role: "admin" } : user
              )
            );
          });
      }
    });
  };

  // Undo admin
  const handleUndoAdmin = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#125ca6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, do it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${baseUrl}/api/user/undoAdmin/${id}`, { method: "PATCH" })
          .then((res) => res.json())
          .then((data) => {
            Swal.fire({
              title: "Done!",
              text: `${data.firstname} ${data.lastname} is no longer an admin`,
              icon: "success",
              confirmButtonColor: "#125ca6",
            });
            setAllUsers((prevUsers) =>
              prevUsers.map((user) =>
                user._id === id ? { ...user, role: data.role } : user
              )
            );
          });
      }
    });
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(allUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) setCurrentPage(pageNumber);
  };
  const handleNextPage = () =>
    currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePreviousPage = () =>
    currentPage > 1 && setCurrentPage((p) => p - 1);

  return (
    <div className="m-6">
      {/* ✅ Helmet for dynamic page title and meta */}
      <Helmet>
        <title>All Users - Admin Dashboard</title>
        <meta
          name="description"
          content="Admin dashboard to view and manage all users. Promote users to admin, delete users, and navigate through paginated list of users."
        />
      </Helmet>

      <h1 className="text-3xl font-bold text-primary mb-6">All Users</h1>

      <div className="overflow-x-hidden border rounded-md">
        <table className="table table-zebra">
          <thead>
            <tr className="grid grid-cols-6">
              <th>Sl no.</th>
              <th className="col-span-3">Name</th>
              <th>Role</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={user._id} className="grid grid-cols-6">
                  <td>{indexOfFirstUser + index + 1}</td>
                  <td className="col-span-3">
                    {user.firstname} {user.lastname}
                  </td>
                  <td>{user.role}</td>
                  <td className="flex gap-2 items-center justify-end">
                    {user.role === "admin" ? (
                      <div className="tooltip" data-tip="Undo Admin">
                        <FaUserMinus
                          className="bg-primary cursor-pointer tooltip p-1 text-2xl text-white rounded"
                          onClick={() => handleUndoAdmin(user._id)}
                        />
                      </div>
                    ) : (
                      <div className="tooltip" data-tip="Make Admin">
                        <FaUserShield
                          className="bg-success cursor-pointer tooltip p-1 text-2xl text-white rounded"
                          onClick={() => handleMakeAdmin(user._id)}
                        />
                      </div>
                    )}
                    <div className="tooltip" data-tip="Delete User">
                      <RiDeleteBin5Line
                        className="bg-error cursor-pointer tooltip p-1 text-2xl text-white rounded"
                        onClick={() => handleDelete(user._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        className={`flex justify-center mt-16 ${
          allUsers.length <= 0 && "hidden"
        }`}
      >
        <nav>
          <ul className="pagination flex items-center gap-3">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`text-2xl py-2 px-4 rounded ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary"
              }`}
            >
              <FaChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link bg-primary text-white py-2 px-4 rounded"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`text-2xl py-2 px-4 rounded ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-primary"
              }`}
            >
              <FaChevronRight />
            </button>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AllUsers;
