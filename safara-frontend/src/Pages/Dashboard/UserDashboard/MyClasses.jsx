import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Ensure Link is imported

import "react-tabs/style/react-tabs.css";
import useAuthContext from "../../../hooks/useAuthContext";

const MyClasses = () => {
  const categories = ["My Classes", "Explore", "Incoming", "Course Details"];
  const { category } = useParams();
  const { user } = useAuthContext();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const initialIndex = categories.indexOf(category);

  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;
  const fetchCourses = () => {
    setLoading(true); // Set loading to true before the request
    const url = `${baseUrl}/api/course/getAllEnrolledCourse/${user?.user?._id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array

        setCourses(data.courses); // Set courses to the array

        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]); // Set courses to an empty array if there's an error
        setLoading(false); // Set loading to false even on error
      });
  };

  useEffect(() => {
    if (user?.user?._id) {
      fetchCourses();
    } else {
      console.log("User is not authenticated.");
    }
  }, [user]); // Re-run when user state changes

  if (loading) {
    return <div>Loading...</div>; // Show loading while fetching courses
  }

  return (
    <div className="lg:p-6 pt-10">
      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 w-fit">
        {courses?.map((course) => (
          <div key={course._id} className="border rounded-xl relative">
            <Link to={`/singleCourse/${course?._id}`}>
              <div className="">
                <img
                  className="w-full object-cover rounded-xl"
                  src={course?.banner}
                  alt={course?.title}
                />
              </div>
            </Link>
            {/* <div className="absolute right-4 top-4 dropdown-container">
                    <BsThreeDots
                      className="bg-primary border cursor-pointer text-white absolute right-0 p-1 text-3xl rounded-full"
                      onClick={(e) => toggleDropdown(course._id, e)} // Toggle dropdown on click
                    />
                    {visibleDropdown === course._id && (
                      <div className="border bg-white w-52 p-3 rounded-md absolute right-0 top-10 z-10">
                        <Link
                          to={`/dashboard/admin/updateCourse/${course?._id}`}
                          className="cursor-pointer flex gap-3 hover:bg-slate-200 p-2 rounded-md"
                        >
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
                  </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClasses;
