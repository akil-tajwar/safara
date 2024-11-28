import React from 'react';
import { FaUsers, FaBookOpen, FaUserGraduate, FaChartLine, FaStar, FaEye, FaCheckCircle, FaClock, FaChevronLeft, FaChevronRight, FaEdit } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { RiDeleteBin5Line } from 'react-icons/ri';

const AdminDashboard = () => {
  const courseCategories = [
    { name: 'Development', count: 150, color: 'bg-blue-500' },
    { name: 'Business', count: 120, color: 'bg-green-500' },
    { name: 'Design', count: 100, color: 'bg-yellow-500' },
    { name: 'Marketing', count: 80, color: 'bg-red-500' },
    { name: 'IT & Software', count: 70, color: 'bg-purple-500' },
  ];

  const recentEnrollments = [
    { id: 1, user: 'John Doe', course: 'Advanced React Patterns', date: '2023-05-15' },
    { id: 2, user: 'Jane Smith', course: 'Machine Learning Fundamentals', date: '2023-05-14' },
    { id: 3, user: 'Bob Johnson', course: 'Digital Marketing Strategies', date: '2023-05-13' },
    { id: 4, user: 'Alice Brown', course: 'UX/UI Design Principles', date: '2023-05-12' },
  ];

  const topPerformingCourses = [
    { id: 1, name: 'Advanced Machine Learning', enrolled: 1234, rating: 4.9, revenue: '$12,345' },
    { id: 2, name: 'Full-Stack Web Development', enrolled: 987, rating: 4.8, revenue: '$9,870' },
    { id: 3, name: 'Data Science Fundamentals', enrolled: 876, rating: 4.7, revenue: '$8,760' },
    { id: 4, name: 'Digital Marketing Mastery', enrolled: 765, rating: 4.6, revenue: '$7,650' },
  ];

  return (
    <div className="min-h-screen  p-8">
      <h1 className="text-3xl font-bold text-[#125ca6] mb-8">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <StatCard icon={<FaUsers />} title="Total Users" value="1,234" change="+5.2%" />
        <StatCard icon={<FaBookOpen />} title="Total Courses" value="42" change="+2.1%" />
        <StatCard icon={<FaUserGraduate />} title="Enrolled Users" value="789" change="+3.7%" />
        <StatCard icon={<FaChartLine />} title="Revenue" value="$12,345" change="+7.8%" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-[#125ca6] mb-4">Course Categories</h2>
          <div className="space-y-4">
            {courseCategories.map((category, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-2 h-2 ${category.color} rounded-full mr-2`}></div>
                <span className="flex-grow">{category.name}</span>
                <span className="font-semibold">{category.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold text-[#125ca6] mb-4">Platform Overview</h2>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard icon={<FaStar className="text-yellow-400" />} title="Average Rating" value="4.8" />
            <MetricCard icon={<FaEye className="text-blue-400" />} title="Total Views" value="250K" />
            <MetricCard icon={<FaCheckCircle className="text-green-400" />} title="Completed Courses" value="5,678" />
            <MetricCard icon={<FaClock className="text-red-400" />} title="Avg. Completion Time" value="4.2 weeks" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white rounded-lg md:col-span-2">
          <h2 className="text-xl font-semibold text-[#125ca6] mb-4">Recent Enrollments</h2>
          <div className="overflow-x-auto border rounded-md">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="grid grid-cols-6">
                  <th className="col-span-2">User</th>
                  <th className="col-span-3">Course</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEnrollments.map((enrollment, index) => (
                  <tr key={enrollment.id} className="grid grid-cols-6">
                    <td className="col-span-2">{enrollment.user}</td>
                    <td className="col-span-3">{enrollment.course}</td>
                    <td>{enrollment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg">
          <h2 className="text-xl font-semibold text-[#125ca6] mb-4">User Activity</h2>
          <div className="h-[222px] flex items-center justify-center border rounded-md">
            {/* Placeholder for user activity chart */}
            <span className="text-gray-400">User Activity Chart</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg">
        <div>
          <h2 className="text-xl font-semibold text-[#125ca6] mb-4">Top Performing Courses</h2>
        </div>
        <div className="overflow-x-auto border rounded-md">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="grid grid-cols-8">
                <th className="col-span-3">Course Name</th>
                <th>Enrolled</th>
                <th>Rating</th>
                <th>Revenue</th>
                <th className="col-span-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {topPerformingCourses.map((course, index) => (
                <tr key={course.id} className="grid grid-cols-8">
                  <td className="col-span-3">{course.name}</td>
                  <td>{course.enrolled}</td>
                  <td>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-1" />
                      {course.rating}
                    </div>
                  </td>
                  <td>{course.revenue}</td>
                  <td className="col-span-2 flex gap-2 items-center justify-end overflow-hidden">
                    <div className="tooltip" data-tip="Delete User">
                      <MdEdit className="bg-[#125ca6] cursor-pointer tooltip p-1 text-2xl text-white rounded"/>
                    </div>
                    <div className="tooltip" data-tip="Delete User">
                      <RiDeleteBin5Line
                        className="bg-error cursor-pointer tooltip p-1 text-2xl text-white rounded"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change }) => (
  <div className="bg-white rounded-lg border p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <div className="text-[#125ca6] text-xl">{icon}</div>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

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

