import { useEffect, useState } from "react";
import {
  FaUsers,
  FaBookOpen,
  FaUserGraduate,
  FaChartLine,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import { Helmet } from "react-helmet"; // ✅ Import Helmet

const AdminDashboard = () => {
  const [countUsers, setCountUsers] = useState([]);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [courseCount, setCourseCount] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);
  const [totalAvgRating, setTotalAvgRating] = useState([]);
  const [courseCategories, setCoursesCategories] = useState([]);
  const [avgCourseCompleteTime, setAvgCourseCompleteTime] = useState([]);
  const [completedCoursesCount, setCompletedCoursesCount] = useState(0);

  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;

  useEffect(() => {
    fetch(`${baseUrl}/api/user/allUsersCount`)
      .then((res) => res.json())
      .then((data) => setCountUsers(data))
      .catch(console.log);

    fetch(`${baseUrl}/api/course/getCourseCount`)
      .then((res) => res.json())
      .then((data) => setCourseCount(data))
      .catch(console.log);

    fetch(`${baseUrl}/api/course/enrolledUsersCourses`)
      .then((res) => res.json())
      .then((data) => setEnrolledUsers(data))
      .catch(console.log);

    fetch(`${baseUrl}/api/course/getTotalPayment`)
      .then((res) => res.json())
      .then((data) => setTotalRevenue(data.totalPayment))
      .catch(console.log);

    fetch(`${baseUrl}/api/course/getCourseCategories`)
      .then((res) => res.json())
      .then((data) => setCoursesCategories(data.categories))
      .catch(console.log);

    fetch(`${baseUrl}/api/course/getAvgRating`)
      .then((res) => res.json())
      .then((data) => setTotalAvgRating(data.avgRating))
      .catch(console.log);

    fetch(`${baseUrl}/api/course/getCompletedCoursesCount`)
      .then((res) => res.json())
      .then((data) => setCompletedCoursesCount(data.totalCompletedCourses))
      .catch(console.log);

    fetch(`${baseUrl}/api/course/getAverageCompletionTime`)
      .then((res) => res.json())
      .then((data) =>
        setAvgCourseCompleteTime(data.averageCompletionTimeInDays)
      )
      .catch(console.log);
  }, []);

  return (
    <div className="min-h-screen lg:p-8 pt-5">
      {/* ✅ Helmet for page title and meta description */}
      <Helmet>
        <title>Admin Dashboard - Course Platform</title>
        <meta
          name="description"
          content="Admin Dashboard to monitor users, courses, revenue, ratings, and course categories on the platform."
        />
      </Helmet>

      <h1 className="text-3xl font-bold text-primary mb-5">Admin Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatCard
          icon={<FaUsers />}
          title="Total Users"
          value={countUsers.usersCount}
        />
        <StatCard
          icon={<FaBookOpen />}
          title="Total Courses"
          value={courseCount.courseCount}
        />
        <StatCard
          icon={<FaUserGraduate />}
          title="Enrolled Users"
          value={enrolledUsers.totalEnrolledStudents}
        />
        <StatCard
          icon={<FaChartLine />}
          title="Revenue"
          value={
            <div className="flex items-center">
              {totalRevenue} <TbCurrencyTaka />
            </div>
          }
        />
      </div>

      {/* Course Categories & Platform Overview */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Course Categories */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Course Categories
          </h2>
          <div className="space-y-4">
            {courseCategories?.map((category, index) => (
              <div key={index} className="flex items-center">
                <span className="flex-grow">
                  {category.name || category.category}
                </span>
                <span className="font-semibold">{category.count || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform Overview */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">
            Platform Overview
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={<FaStar className="text-yellow-400" />}
              title="Average Rating"
              value={totalAvgRating}
            />
            <MetricCard
              icon={<FaCheckCircle className="text-green-400" />}
              title="Completed Courses"
              value={completedCoursesCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg border p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <div className="text-primary text-xl">{icon}</div>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

// MetricCard Component
const MetricCard = ({ icon, title, value }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center mb-2">
      {icon}
      <h3 className="ml-2 text-sm font-medium text-gray-500">{title}</h3>
    </div>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

export default AdminDashboard;
