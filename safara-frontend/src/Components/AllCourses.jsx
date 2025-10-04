import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;

  const fetchCourses = () => {
    const url = `${baseUrl}/api/course/getAllCourses`; // Your courses endpoint
    fetch(url)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="w-3/4 mx-auto pb-20">
      <Helmet>
        <title>All Courses - Safara</title>
        <meta
          name="description"
          content="Explore all courses offered by Safara. Find the perfect course to enhance your skills and knowledge."
        />
        <meta property="og:title" content="All Courses - Safara" />
        <meta
          property="og:description"
          content="Explore all courses offered by Safara. Find the perfect course to enhance your skills and knowledge."
        />
      </Helmet>

      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 w-fit">
        {courses?.map((course) => (
          <div
            key={course._id}
            className="border rounded-xl relative hover:shadow-lg transition-shadow duration-300"
          >
            <Link to={`/singleCourse/${course?._id}`}>
              <img
                className="w-full object-cover rounded-xl"
                src={course?.banner}
                alt={course?.title}
              />
              <div className="absolute bottom-3 left-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                {course?.title}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourses;
