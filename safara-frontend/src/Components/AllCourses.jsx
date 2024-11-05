import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const AllCourses = () => {
     const [courses, setCourses]= useState([])

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
    <div>
      <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 gap-5 w-fit">
        {courses?.map((course) => (
          <div key={course._id} className="border rounded-xl relative">
            <Link to={`/singleCourse/${course?._id}`}>
              <div className="">
                <img className="w-80 h-80 object-cover rounded-xl" src={course?.banner} alt={course?.title} />
              </div>
            </Link>
          
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCourses;
