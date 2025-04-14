import { useState, useEffect } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaUserMinus,
  FaUserShield,
  FaUserTimes,
} from "react-icons/fa";
import { FaUserCheck } from "react-icons/fa6";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";

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

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#125ca6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        confirmButton: "custom-confirm-btn",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${baseUrl}/api/user/deleteUser/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            Swal.fire({
              title: "Deleted!",
              text: "The user has been deleted.",
              icon: "success",
              confirmButtonColor: "#125ca6",
              customClass: {
                confirmButton: "custom-confirm-btn",
              },
            });
            fetchAllUsers();
          })
          .catch((error) => {
            Swal.fire({
              title: "Error!",
              text: "There was an error deleting the user.",
              icon: "error",
              confirmButtonColor: "#125ca6",
              customClass: {
                confirmButton: "custom-confirm-btn",
              },
            });
          });
      }
    });
  };

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
          headers: {
            "Content-Type": "application/json",
          },
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
            setAllUsers((prevUsers) => {
              return prevUsers.map((prevUser) => {
                if (prevUser._id === id) {
                  return { ...prevUser, role: "admin" };
                } else {
                  return prevUser;
                }
              });
            });
          });
      }
    });
  };

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
        fetch(`${baseUrl}/api/user/undoAdmin/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            Swal.fire({
              title: "Done!",
              text: `${data.firstname} ${data.lastname} is no longer an admin`,
              icon: "success",
              confirmButtonColor: "#125ca6",
            });
            setAllUsers((prevUsers) => {
              return prevUsers.map((prevUser) => {
                if (prevUser._id === id) {
                  return { ...prevUser, role: data.role };
                } else {
                  return prevUser;
                }
              });
            });
          });
      }
    });
  };

  const handleSuspendUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, suspend!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${baseUrl}/api/user/suspendUser/${id}`, {
          method: "PATCH",
        })
          .then((res) => res.json())
          .then((data) => {
            Swal.fire({
              title: "Done!",
              text: `${data.firstname} ${data.lastname} has been suspended`,
              icon: "success",
            });
            setAllUsers((prevUsers) => {
              return prevUsers.map((prevUser) => {
                if (prevUser._id === id) {
                  return { ...prevUser, isSuspended: true };
                } else {
                  return prevUser;
                }
              });
            });
          });
      }
    });
  };

  const handleContinueUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, continue!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${baseUrl}/api/user/continueUser/${id}`, {
          method: "PATCH",
        })
          .then((res) => res.json())
          .then((data) => {
            Swal.fire({
              title: "Done!",
              text: `${data.firstname} ${data.lastname} has been reinstated`,
              icon: "success",
            });
            setAllUsers((prevUsers) => {
              return prevUsers.map((prevUser) => {
                if (prevUser._id === id) {
                  return { ...prevUser, isSuspended: false };
                } else {
                  return prevUser;
                }
              });
            });
          });
      }
    });
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(allUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className=" m-6">
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

      {/* Pagination Controls */}
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
