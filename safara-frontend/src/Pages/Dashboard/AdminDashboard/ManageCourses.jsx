import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [visibleDropdown, setVisibleDropdown] = useState(null); // To track the visible dropdown
  const baseUrl= import.meta.env.VITE_BASE_URL;
  const fetchCourses = () => {
    const url = `${baseUrl}/api/course/getAllCourses`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle delete confirmation
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
        fetch(`${baseUrl}/api/course/deleteCourse/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "The course has been deleted.",
              icon: "success",
              confirmButtonColor: "#125ca6",
            });
            fetchCourses();
          })
          .catch(() => {
            Swal.fire({
              title: "Error!",
              text: "There was an error deleting the course.",
              icon: "error",
              confirmButtonColor: "#125ca6",
            });
          });
      }
    });
  };

  // Toggle the visibility of the dropdown
  const toggleDropdown = (id, e) => {
    e.stopPropagation(); // Prevent the click from propagating to the card
    if (visibleDropdown === id) {
      setVisibleDropdown(null); // Close if already open
    } else {
      setVisibleDropdown(id); // Show the dropdown for the clicked course
    }
  };

  // Close dropdown if clicked outside
  const handleOutsideClick = (e) => {
    if (!e.target.closest(".dropdown-container")) {
      setVisibleDropdown(null); // Close dropdown when clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  return (
    <div className="lg:p-6 pt-10">
      <h1 className="text-3xl font-bold text-primary mb-8">Manage Courses</h1>
      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 w-fit relative z-10">
        {courses?.map((course) => (
          <div key={course._id} className="border rounded-xl relative ">
            <Link to={`/singleCourse/${course?._id}`}>
              <div className="">
                <img className="w-full object-cover rounded-xl" src={course?.banner} alt={course?.title} />
              </div>
            </Link>
            <div className="absolute right-4 top-4 dropdown-container">
              <BsThreeDots
                className="bg-primary border cursor-pointer text-white absolute right-0 p-1 text-3xl rounded-full"
                onClick={(e) => toggleDropdown(course._id, e)} // Toggle dropdown on click
              />
              {visibleDropdown === course._id && (
                <div className="border bg-white w-52 p-3 rounded-md absolute right-0 top-10 z-10">
                  <Link to={`/dashboard/admin/updateCourse/${course?._id}`} className="cursor-pointer flex gap-3 hover:bg-slate-200 p-2 rounded-md">
                    <MdEdit className="tooltip p-1 text-2xl bg-primary text-white rounded-full" />
                    <p>Update Course</p>
                  </Link>
                  <div
                    onClick={() => handleDelete(course._id)}
                    className="cursor-pointer flex gap-3 hover:bg-slate-200 p-2 rounded-md"
                  >
                    <RiDeleteBin5Line className="tooltip p-1 text-2xl bg-primary text-white rounded-full" />
                    <p>Delete Course</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCourses;