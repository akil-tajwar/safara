import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaBookOpen, FaCertificate } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import useAuthContext from "../../../hooks/useAuthContext";

const UserHome = () => {
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalEnrolledCourses, setTotalEnrolledCourses] = useState(0);
  const [coursesByStudent, setCoursesByStudent] = useState([]);
  const [certificateEarned, setCertificateEarned] = useState(0);

  const { user } = useAuthContext();
  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;
  const fetchTotalSpent = () => {
    fetch(`${baseUrl}/api/course/getSpentByStudent/${user?.user?._id}`)
      .then((res) => res.json())
      .then((data) => setTotalSpent(data.totalPayment))
      .catch((error) => console.log(error));
  };

  const fetchEnrolledCourses = () => {
    fetch(`${baseUrl}/api/course/getAllEnrolledCourse/${user?.user?._id}`)
      .then((res) => res.json())
      .then((data) => {
        setTotalEnrolledCourses(data.courses.length);
        setCoursesByStudent(data.courses);

        // Count completed courses for certificates
        const completedCourses = data.courses.reduce((count, course) => {
          const studentData = course.students.find(
            (student) => student.studentsId === user.user._id
          );
          return count + (studentData?.isCourseComplete ? 1 : 0);
        }, 0);
        setCertificateEarned(completedCourses);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (user) {
      fetchTotalSpent();
      fetchEnrolledCourses();
    }
  }, [user]);

  return (
    <div className="min-h-screen lg:p-8 pt-5 bg-gray-50">
      <h1 className="text-3xl font-bold text-primary mb-8">
        Welcome, {user?.user?.name || "User"}!
      </h1>

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
          value={certificateEarned}
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
        <h2 className="text-xl font-semibold text-primary mb-4">
          Your Courses Progress
        </h2>
        <div className="space-y-4">
          {coursesByStudent.map((course) => (
            <CourseProgressCard
              key={course._id}
              course={course}
              userId={user.user._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg border p-6 ">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <div className="text-primary text-xl">{icon}</div>
    </div>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]).isRequired,
};

// CourseProgressCard Component
const CourseProgressCard = ({ course, userId }) => {
  const studentData = course.students.find(
    (student) => student.studentsId === userId
  );
  const totalVideos = course.videos.length;
  const unlockedVideos = studentData?.unlockedVideo || 0;
  const progress = totalVideos > 0 ? (unlockedVideos / totalVideos) * 100 : 0;

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-lg mb-2">{course.title}</h3>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-500">Progress</span>
        <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        {unlockedVideos} / {totalVideos} videos completed
      </p>
      {studentData?.isCourseComplete && (
        <div className="mt-2 text-sm text-green-600 font-medium">
          Course Completed! 🎉
        </div>
      )}
    </div>
  );
};

CourseProgressCard.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    videos: PropTypes.arrayOf(PropTypes.object).isRequired,
    students: PropTypes.arrayOf(
      PropTypes.shape({
        studentsId: PropTypes.string.isRequired,
        unlockedVideo: PropTypes.number,
        isCourseComplete: PropTypes.bool,
      })
    ).isRequired,
  }).isRequired,
  userId: PropTypes.string.isRequired,
};

export default UserHome;
