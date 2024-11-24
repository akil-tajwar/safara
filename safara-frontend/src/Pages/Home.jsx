import useAuthContext from "../hooks/useAuthContext";
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';


// import required modules
import { Pagination } from 'swiper/modules';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Home = () => {
  const { user } = useAuthContext();
  console.log("🚀 ~ Home ~ user:", user);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    // Fetch top courses from the API
    const fetchTopCourses = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/course/topCourses");
        if (!response.ok) {
          throw new Error("Failed to fetch top courses");
        }
        const data = await response.json();
        setCourses(data.data); // Assuming the API returns a "data" field with the courses
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTopCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;















  

  return (
    <div className="w-3/4 mx-auto">

      <div className="grid grid-cols-2 gap-5 items-center">
        <div>
          <div>
            <h3 className="text-6xl font-semibold">Best learning Platform</h3>
            <h3 className="text-6xl font-semibold text-[#125ca6]">
              In the world
            </h3>
          </div>
          <p className="my-5 text-justify">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit.
            Voluptatibus, praesentium. Molestias ipsa debitis eaque laudantium
            libero magni. Perferendis vel sequi velit in voluptas deleniti
            praesentium, exercitationem optio nisi dicta ea?
          </p>
          {user?.user ? (
            user?.user?.role === 'admin' ? (
              <Link to={'/dashboard/admin/adminHome'}>
                <button className="bg-[#125ca6] text-white px-3 py-2 rounded-md font-semibold">
                  Get Started
                </button>
              </Link>
            ) : (
              <Link to={'/dashboard/user/userHome'}>
                <button className="bg-[#125ca6] text-white px-3 py-2 rounded-md font-semibold">
                  Get Started
                </button>
              </Link>
            )
          ) : (
            <Link to={'/login'}>
              <button className="bg-[#125ca6] text-white px-3 py-2 rounded-md font-semibold">
                Get Started
              </button>
            </Link>
          )}
        </div>
        <div>
          <img src="banner.png" alt="" />
        </div>
      </div>

      {/* learn more started  */}
      <div className="grid grid-cols-2 gap-5 mt-20">
        <div className="">
          <div className="grid grid-cols-2 gap-5 w-fit">
            <img src="/learn1.jpg" alt="" className="w-[350px] h-[220px] object-cover" />
            <img src="/learn2.jpg" alt="" className="w-[350px] h-[220px] object-cover" />
            <img src="/learn3.jpg" alt="" className="w-[350px] h-[220px] object-cover" />
            <img src="/learn4.jpg" alt="" className="w-[350px] h-[220px] object-cover" />
          </div>
        </div>
        <div className="">
          <h1 className="text-[#125ca6] font-medium text-4xl mb-5">
            Learn More
          </h1>
          <p className="text-justify">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            autem aperiam repellat quae ipsa?
          </p>
          <p className="text-justify pt-5">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            autem aperiam repellat quae ipsa? Sunt soluta necessitatibus iusto,
            corporis fugiat molestias repudiandae cum dolorum hic nam eum fugit.
            Quod cumque doloribus iste ab cupiditate ratione deserunt laboriosam
            harum architecto repellendus!
          </p>
          <p className="text-justify pt-5">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Explicabo
            autem aperiam repellat quae ipsa? Sunt soluta necessitatibus iusto,
            corporis fugiat molestias repudiandae cum dolorum hic nam eum fugit.
          </p>
        </div>
      </div>
      {/* lear more ended  */}

      {/* stat of user  */}
      <div className="mt-20 w-full ">
        <div className="stats shadow mx-auto w-full bg-[#125ca6] text-white">
          <div className="stat place-items-center">
            <div className="stat-title text-white">Users</div>
            <div className="stat-value">31K</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title text-white">Awards</div>
            <div className="stat-value text-secondary">4,200</div>
          </div>

          <div className="stat place-items-center">
            <div className="stat-title text-white">Vip Users</div>
            <div className="stat-value">1,200</div>
          </div>
        </div>
      </div>

      {/* stat ended    */}

      {/* top 6 course according top 6 rating */}

      <div className="mt-20 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-y-10 mb-20">
      {courses.map((course) => (
        <div key={course._id}>
          <img
            src={course.banner || "/placeholder.jpg"} // Fallback image if banner is not available
            alt={course.title}
            className="w-[100px] h-[100px] rounded-xl"
          />
          <h3 className="font-medium text-2xl text-[#125ca6]">{course.title}</h3>
          <p className="font-bold">{course.details || "No details available."}</p>
          <p className="text-sm text-gray-500">Rating: {course.averageRating.toFixed(1)}</p>
        </div>
      ))}
    </div>

    </div>
  );
};

export default Home;
