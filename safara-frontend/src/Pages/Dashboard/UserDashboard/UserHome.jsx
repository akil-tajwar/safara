import { useEffect, useState } from "react";
import { FaBookOpen, FaCertificate, FaStar } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import useAuthContext from "../../../hooks/useAuthContext";

const UserHome = () => {
  const [totalSpent, setTotalSpent] = useState([]);
  const [totalEnrolledCourses, setTotalEnrolledCourses] = useState([]);
  const [videosCount, setVideosCount] = useState([]);
  const [coursesByStudent, setCoursesByStudent] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);

  const { user } = useAuthContext();
  // Dummy data for enrolled courses
  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to React",
      progress: 60,
      totalLessons: 20,
      completedLessons: 12,
    },
    {
      id: 2,
      title: "Advanced JavaScript Concepts",
      progress: 30,
      totalLessons: 25,
      completedLessons: 7,
    },
    {
      id: 3,
      title: "UI/UX Design Fundamentals",
      progress: 80,
      totalLessons: 15,
      completedLessons: 12,
    },
  ];

  // Dummy data for recommended courses
  const recommendedCourses = [
    { id: 4, title: "Node.js Basics", rating: 4.7, duration: "4 weeks" },
    {
      id: 5,
      title: "Python for Data Science",
      rating: 4.9,
      duration: "6 weeks",
    },
    { id: 6, title: "Responsive Web Design", rating: 4.5, duration: "3 weeks" },
  ];

  const fetchTotalSpent = () => {
    fetch(
      `http://localhost:4000/api/course/getSpentByStudent/${user?.user?._id}`
    )
      .then((res) => res.json())
      .then((data) => setTotalSpent(data.totalPayment))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (user) {
      fetchTotalSpent();
    } // Fetch users count when component mounts
  }, []);

  const fetchEnrolledCourses = () => {
    fetch(
      `http://localhost:4000/api/course/getAllEnrolledCourse/${user?.user?._id}`
    )
      .then((res) => res.json())
      .then((data) => {
        setTotalEnrolledCourses(data.courses.length);
        setCoursesByStudent(data.courses);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    } // Fetch users count when component mounts
  }, []);

  console.log("totalenrolled", totalEnrolledCourses);
  console.log("coursesPurchased", coursesByStudent);

  return (
    <div className="min-h-screen lg:p-8 pt-5 bg-gray-50">
      <h1 className="text-3xl font-bold text-[#125ca6] mb-8">Welcome, User!</h1>

      {/* User Stats */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <StatCard
          icon={<FaBookOpen />}
          title="Enrolled Courses"
          value={totalEnrolledCourses}
        />
        <StatCard
          icon={<FaCertificate />}
          title="Certificates Earned"
          value="3"
        />
        <StatCard
          icon={<TbCurrencyTaka />}
          title="Total Spent"
          value={
            <div className="flex items-center">
              {totalSpent}
              <TbCurrencyTaka className="ml-1" />
            </div>
          }
        />
      </div>

      {/* Enrolled Courses and Progress */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-semibold text-[#125ca6] mb-4">
          Your Enrolled Courses
        </h2>
        <div className="space-y-4">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold text-[#125ca6] mb-4">
          Recommended Courses
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {recommendedCourses.map((course) => (
            <RecommendedCourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

// StatCard Component (reused from AdminDashboard)
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg border p-6 ">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <div className="text-[#125ca6] text-xl">{icon}</div>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

// CourseProgressCard Component
const CourseProgressCard = ({ course }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm text-gray-500">Progress</span>
      <span className="text-sm font-medium">{course.progress}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${course.progress}%` }}
      ></div>
    </div>
    <p className="text-sm text-gray-500 mt-2">
      {course.completedLessons} / {course.totalLessons} lessons completed
    </p>
  </div>
);

// RecommendedCourseCard Component
const RecommendedCourseCard = ({ course }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
    <div className="flex items-center mb-2">
      <FaStar className="text-yellow-400 mr-1" />
      <span className="text-sm font-medium">{course.rating}</span>
    </div>
    <p className="text-sm text-gray-500">Duration: {course.duration}</p>
    <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
      Enroll Now
    </button>
  </div>
);

export default UserHome;
