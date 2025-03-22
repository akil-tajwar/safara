import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
const baseUrl = process.env.SAFARA_baseUrl;

const AllCourses = () => {
     const [courses, setCourses]= useState([])
     console.log("🚀 ~ AllCourses ~ baseUrl:", baseUrl)

    const fetchCourses = () => {
        const url = `http://localhost:4000/api/course/getAllCourses`; // Your courses endpoint
        fetch(url)
          .then((res) => res.json())
          .then((data) => {
            setCourses(data);
    
           // Check enrollment with the fetched courses
          })
          .catch((error) => console.log(error));
      };

  useEffect(() => {
    fetchCourses()
  }, []);

  return (
    <div className="w-3/4 mx-auto pb-20">
      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 w-fit">
        {courses?.map((course) => (
          <div key={course._id} className="border rounded-xl relative">
            <Link to={`/singleCourse/${course?._id}`}>
              <div className="">
                <img className="w-full object-cover rounded-xl" src={course?.banner} alt={course?.title} />
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourses;
