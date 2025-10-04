import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet"; // ✅ Helmet import
import "react-tabs/style/react-tabs.css";
import useAuthContext from "../../../hooks/useAuthContext";

const MyClasses = () => {
  const categories = ["My Classes", "Explore", "Incoming", "Course Details"];
  const { category } = useParams();
  const { user } = useAuthContext();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialIndex = categories.indexOf(category);

  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;

  const fetchCourses = () => {
    setLoading(true);
    const url = `${baseUrl}/api/course/getAllEnrolledCourse/${user?.user?._id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses || []); // safe fallback
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user?.user?._id) {
      fetchCourses();
    } else {
      console.log("User is not authenticated.");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <span className="loading loading-spinner w-40 h-40 text-white"></span>
      </div>
    );
  }

  return (
    <div className="lg:p-6 pt-10">
      {/* ✅ Helmet for SEO */}
      <Helmet>
        <title>My Classes - Mahad</title>
        <meta
          name="description"
          content="View and manage all your enrolled courses at Mahad. Access class details, explore incoming lessons, and continue your learning journey."
        />
      </Helmet>

      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 w-fit">
        {courses?.map((course) => (
          <div key={course._id} className="border rounded-xl relative">
            <Link to={`/singleCourse/${course?._id}`}>
              <div>
                <img
                  className="w-full object-cover rounded-xl"
                  src={course?.banner}
                  alt={course?.title}
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyClasses;
