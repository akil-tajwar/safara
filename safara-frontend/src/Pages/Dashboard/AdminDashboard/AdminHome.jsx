import React, { useEffect, useState } from "react";
import { FaUsers, FaBookOpen, FaUserGraduate, FaChartLine, FaStar, FaEye, FaCheckCircle, FaClock } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

const AdminDashboard = () => {
  // State variables for storing various counts and data
  const [countUsers, setCountUsers] = useState([]);
  const [enrolledUsers, setEnrolledUsers] = useState([]);
  const [courseCount, setCourseCount] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState([]);
  const [totalAvgRating, setTotalAvgRating] = useState([]);
  const [courseCategories, setCoursesCategories] = useState([]);
  const [completedCoursesCount, setCompletedCoursesCount] = useState(0);

  // Fetching the total number of users
  const fetchCountUsers = () => {
    fetch(`http://localhost:4000/api/user/allUsersCount`)
      .then((res) => res.json())
      .then((data) => setCountUsers(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchCountUsers(); // Fetch users count when component mounts
  }, []);

  // Fetching the total number of courses
  const fetchCourseCount = () => {
    fetch(`http://localhost:4000/api/course/getCourseCount`)
      .then((res) => res.json())
      .then((data) => setCourseCount(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchCourseCount(); // Fetch course count when component mounts
  }, []);

  // Fetching the total number of enrolled users
  const fetchEnrolledUsers = () => {
    fetch(`http://localhost:4000/api/course/enrolledUsersCourses`)
      .then((res) => res.json())
      .then((data) => setEnrolledUsers(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchEnrolledUsers(); // Fetch enrolled users when component mounts
  }, []);

  // Fetching total revenue
  const fetchTotalRevenue = () => {
    fetch(`http://localhost:4000/api/course/getTotalRevenue`)
      .then((res) => res.json())
      .then((data) => setTotalRevenue(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTotalRevenue(); // Fetch total revenue when component mounts
  }, []);

  // Fetching course categories and their counts
  const fetchCourseCategories = () => {
    fetch(`http://localhost:4000/api/course/getCourseCategories`)
      .then((res) => res.json())
      .then((data) => setCoursesCategories(data.categories))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchCourseCategories(); // Fetch course categories when component mounts
  }, []);

  // Fetching the total average rating
  const fetchTotalAverageRating = () => {
    fetch(`http://localhost:4000/api/course/getAvgRating`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Total average rating:", data.avgRating); // Debugging the fetched data
        setTotalAvgRating(data.avgRating); // Update the state with the fetched average rating
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchTotalAverageRating(); // Fetch total average rating when component mounts
  }, []);

  // Fetching the completed courses count
  const fetchCompletedCoursesCount = () => {
    fetch(`http://localhost:4000/api/course/getCompletedCoursesCount`)
      .then((res) => res.json())
      .then((data) => {
        setCompletedCoursesCount(data.totalCompletedCourses); // Set the completed courses count
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchCompletedCoursesCount(); // Fetch completed courses count when component mounts
  }, []);
  

  console.log(completedCoursesCount);
  // Array of colors to dynamically assign to categories
  const categoryColors = [
    "bg-red-200",
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-indigo-200",
    "bg-teal-200",
  ];

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-[#125ca6] mb-8">Admin Dashboard</h1>

      {/* Dashboard Stats */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatCard icon={<FaUsers />} title="Total Users" value={countUsers.usersCount} change="+5.2%" />
        <StatCard icon={<FaBookOpen />} title="Total Courses" value={courseCount.courseCount} change="+2.1%" />
        <StatCard icon={<FaUserGraduate />} title="Enrolled Users" value={enrolledUsers.totalEnrolledStudents} change="+3.7%" />
        <StatCard icon={<FaChartLine />} title="Revenue" value={totalRevenue.totalRevenue} change="+7.8%" />
      </div>

      {/* Course Categories and Platform Overview */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        {/* Course Categories Section */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-[#125ca6] mb-4">Course Categories</h2>
          <div className="space-y-4">
            {courseCategories.map((category, index) => (
              <div key={index} className={`flex items-center ${categoryColors[index % categoryColors.length]}`}>
                <span className="flex-grow">{category.name || category.category}</span>
                <span className="font-semibold">{category.count || 0}</span> {/* Displaying course count */}
              </div>
            ))}
          </div>
        </div>

        {/* Platform Overview Section */}
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-[#125ca6] mb-4">Platform Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard icon={<FaStar className="text-yellow-400" />} title="Average Rating" value={totalAvgRating} />
            <MetricCard icon={<FaEye className="text-blue-400" />} title="Total Views" value="250K" />
            <MetricCard icon={<FaCheckCircle className="text-green-400" />} title="Completed Courses" value={completedCoursesCount} />
            <MetricCard icon={<FaClock className="text-red-400" />} title="Avg. Completion Time" value="4.2 weeks" />
          </div>
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value, change }) => (
  <div className="bg-white rounded-lg border p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <div className="text-[#125ca6] text-xl">{icon}</div>
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
