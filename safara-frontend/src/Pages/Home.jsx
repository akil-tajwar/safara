import useAuthContext from "../hooks/useAuthContext";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const Home = () => {
  const { user } = useAuthContext();
  console.log("🚀 ~ Home ~ user:", user);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:4000/api/course/topCourses"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch top courses");
        }
        const data = await response.json();
        setCourses(data.data);
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
    <div className="lg:w-3/4 w-11/12 mx-auto">
      <div className="lg:grid lg:grid-cols-2 flex flex-col-reverse gap-5 items-center">
        <div>
          <div>
            <h3 className="text-6xl font-semibold">Best learning Platform</h3>
            <h3 className="text-6xl font-semibold text-primary">
              In the world
            </h3>
          </div>
          <p className="my-5 text-justify">
            Welcome to Safara Learning Center – your gateway to quality
            education! Explore interactive courses, expert-led lessons, and a
            community-driven learning experience. Whether you&apos;re enhancing
            skills or starting fresh, we provide the tools you need for success.
          </p>
          {user?.user ? (
            user?.user?.role === "admin" ? (
              <Link to={"/dashboard/admin/adminHome"}>
                <button className="bg-primary hover:bg-secondary text-white px-3 py-2 rounded-md font-semibold">
                  Get Started
                </button>
              </Link>
            ) : (
              <Link to={"/dashboard/user/userHome"}>
                <button className="bg-primary hover:bg-secondary text-white px-3 py-2 rounded-md font-semibold">
                  Get Started
                </button>
              </Link>
            )
          ) : (
            <Link to={"/login"}>
              <button className="bg-primary hover:bg-secondary text-white px-3 py-2 rounded-md font-semibold">
                Get Started
              </button>
            </Link>
          )}
        </div>
        <div>
          <img src="banner.png" alt="" />
        </div>
      </div>

      <div className="relative pt-32">
        <div className="absolute top-[96px] left-0 right-0 flex justify-center">
          <div>
            <div className="flex gap-2 justify-center mb-2">
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
            </div>
            <h4 className="text-2xl font-semibold text-center bg-primary text-white rounded-full px-5 py-1 border-4 border-white">
              Top Rated Courses
            </h4>
          </div>
        </div>
        <div className="mb-20 mt-5 bg-primary w-full mx-auto rounded-xl p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 w-fit gap-5">
            {courses.map((course) => (
              <Link
                to={`/singleCourse/${course._id}`}
                key={course._id}
                className="relative"
              >
                <img
                  src={course.banner}
                  alt={course.title}
                  className="rounded-md md:w-52 h-52 w-full object-cover"
                />
                <div className="flex gap-2 items-center border border-gray-500 bg-black bg-opacity-60 w-fit px-1 rounded-full absolute top-2 right-2">
                  <FaStar className="text-yellow-400" />
                  <p className="text-sm text-white">
                    {course.averageRating.toFixed(1)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* learn more started  */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 my-20">
        <div className="">
          <div className="grid grid-cols-2 gap-5 w-fit">
            <img
              src="/learn1.jpg"
              alt=""
              className="w-[350px] h-[220px] object-cover"
            />
            <img
              src="/learn2.jpg"
              alt=""
              className="w-[350px] h-[220px] object-cover"
            />
            <img
              src="/learn3.jpg"
              alt=""
              className="w-[350px] h-[220px] object-cover"
            />
            <img
              src="/learn4.jpg"
              alt=""
              className="w-[350px] h-[220px] object-cover"
            />
          </div>
        </div>
        <div className="">
          <h1 className="text-primary font-medium text-4xl mb-5">Learn More</h1>
          <p className="text-justify">
            At Safara Learning Center, we believe in making education
            accessible, engaging, and effective. Our platform is designed to
            help learners of all levels develop new skills, enhance their
            knowledge, and achieve their goals through expert-led courses and
            interactive learning resources.
          </p>
          <p className="text-justify pt-5">
            Whether you&apos;re looking to advance in your career, prepare for exams,
            or simply explore a new subject, we provide a wide range of courses
            tailored to your needs. With a focus on high-quality content,
            hands-on exercises, and real-world applications, Safara Learning
            Center ensures that every learner gains practical skills that can be
            applied immediately.
          </p>
          <p className="text-justify pt-5">
            Join our community of passionate learners and experienced educators
            who are committed to helping you succeed. With flexible learning
            schedules, interactive materials, and personalized guidance, Safara
            Learning Center empowers you to take control of your learning
            journey.
          </p>
        </div>
      </div>
      {/* lear more ended  */}
      {/* <div className="mt-20 w-full ">
        <div className="stats shadow mx-auto w-full bg-primary text-white">
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
      </div> */}
    </div>
  );
};

export default Home;
