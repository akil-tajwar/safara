import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";

const AllUsers = () => {
    const [allUsers, setAllUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 15; // Number of users to display per page

    const fetchAllUsers = () => {
        const url = `http://localhost:4000/api/user/allUsers`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setAllUsers(data);
                // console.log(data);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const handleDelete = (id) => {
        console.log(id);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#125ca6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            customClass: {
                confirmButton: 'custom-confirm-btn'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`http://localhost:4000/api/user/deleteUser/${id}`, {
                    method: "DELETE",
                })
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data);
                        Swal.fire({
                            title: "Deleted!",
                            text: "The user has been deleted.",
                            icon: "success",
                            confirmButtonColor: "#125ca6",
                            customClass: {
                                confirmButton: 'custom-confirm-btn'
                            }
                        });
                        fetchAllUsers();
                    })
                    .catch((error) => {
                        console.log(error);
                        Swal.fire({
                            title: "Error!",
                            text: "There was an error deleting the user.",
                            icon: "error",
                            confirmButtonColor: "#125ca6",
                            customClass: {
                                confirmButton: 'custom-confirm-btn'
                            }
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
        <div>
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                        <tr className="grid grid-cols-6">
                            <th>Sl no.</th>
                            <th className="col-span-3">Name</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (
                                <tr key={user._id} className="grid grid-cols-6">
                                    <td>{indexOfFirstUser + index + 1}</td>
                                    <td className="col-span-3">{user.firstname} {user.lastname}</td>
                                    <td>{user.role}</td>
                                    <td className='flex gap-2 items-center'>
                                        <button className='bg-[#125ca6] text-white rounded px-1 py-[2px]'>Make Admin</button>
                                        <button className='bg-warning text-white rounded px-1 py-[2px]'>Suspend User</button>
                                        <RiDeleteBin5Line
                                            className="bg-error p-1 text-2xl text-white rounded"
                                            onClick={() => handleDelete(user._id)}
                                        />
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
            <div className={`flex justify-center mt-16 ${allUsers.length <= 0 && 'hidden'}`}>
                <nav>
                    <ul className="pagination flex items-center gap-3">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className={`text-2xl py-2 px-4 rounded ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-[#125ca6]'}`}
                        >
                            <FaChevronLeft />
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button
                                    className="page-link bg-[#125ca6] text-white py-2 px-4 rounded"
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`text-2xl py-2 px-4 rounded ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-[#125ca6]'}`}
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
