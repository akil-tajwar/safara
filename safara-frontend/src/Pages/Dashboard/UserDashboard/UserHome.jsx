import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { FaBookOpen, FaCertificate } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import useAuthContext from "../../../hooks/useAuthContext";

const UserHome = () => {
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalEnrolledCourses, setTotalEnrolledCourses] = useState(0);
  const [coursesByStudent, setCoursesByStudent] = useState([]);
<<<<<<< HEAD
  const [completedLessons, setCompletedLessons] = useState([]);
  
  const { user } = useAuthContext();
  
  console.log(coursesByStudent);
  
  // Dummy data for enrolled courses


  // const enrolledCourses = [
  //   {
  //     id: 1,
  //     title: "Introduction to React",
  //     progress: 60,
  //     totalLessons: 20,
  //     completedLessons: 12,
  //   },
  //   {
  //     id: 2,
  //     title: "Advanced JavaScript Concepts",
  //     progress: 30,
  //     totalLessons: 25,
  //     completedLessons: 7,
  //   },
  //   {
  //     id: 3,
  //     title: "UI/UX Design Fundamentals",
  //     progress: 80,
  //     totalLessons: 15,
  //     completedLessons: 12,
  //   },
  // ];

  // Dummy data for recommended courses
  // const recommendedCourses = [
  //   { id: 4, title: "Node.js Basics", rating: 4.7, duration: "4 weeks" },
  //   {
  //     id: 5,
  //     title: "Python for Data Science",
  //     rating: 4.9,
  //     duration: "6 weeks",
  //   },
  //   { id: 6, title: "Responsive Web Design", rating: 4.5, duration: "3 weeks" },
  // ];
=======
  const [certificateEarned, setCertificateEarned] = useState(0);

  const { user } = useAuthContext();
>>>>>>> 8fab81122832fc3810b69e9175764009fd4ff559

  const fetchTotalSpent = () => {
    fetch(
      `http://localhost:4000/api/course/getSpentByStudent/${user?.user?._id}`
    )
      .then((res) => res.json())
      .then((data) => setTotalSpent(data.totalPayment))
      .catch((error) => console.log(error));
  };

<<<<<<< HEAD
  useEffect(() => {
    if (user) {
      fetchTotalSpent();
    } // Fetch users count when component mounts
  }, []);


=======
>>>>>>> 8fab81122832fc3810b69e9175764009fd4ff559
  const fetchEnrolledCourses = () => {
    fetch(
      `http://localhost:4000/api/course/getAllEnrolledCourse/${user?.user?._id}`
    )
      .then((res) => res.json())
      .then((data) => {
<<<<<<< HEAD
        const updatedCourses = data.courses.map((course) => {
          const studentData = course.students.find(
            (student) => student.studentId === user?.user?._id
          );
          return {
            ...course,
            unlockedVideo: studentData?.unlockedVideo || 0,
          };
        });
  
        setTotalEnrolledCourses(updatedCourses.length);
        setCoursesByStudent(updatedCourses);
=======
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
>>>>>>> 8fab81122832fc3810b69e9175764009fd4ff559
      })
      .catch((error) => console.log(error));
  };
  
  useEffect(() => {
    if (user) {
      fetchTotalSpent();
      fetchEnrolledCourses();
    }
  }, [user]);
<<<<<<< HEAD


=======
>>>>>>> 8fab81122832fc3810b69e9175764009fd4ff559

  return (
    <div className="min-h-screen lg:p-8 pt-5 bg-gray-50">
      <h1 className="text-3xl font-bold text-[#125ca6] mb-8">
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
        <h2 className="text-xl font-semibold text-[#125ca6] mb-4">
          Your Courses Progress
        </h2>
        <div className="space-y-4">
<<<<<<< HEAD
          {coursesByStudent?.map((course) => (
            <CourseProgressCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-xl font-semibold text-[#125ca6] mb-4">
          Recommended Courses
        </h2>
        {/* <div className="grid gap-4 md:grid-cols-3">
          {recommendedCourses?.map((course) => (
            <RecommendedCourseCard key={course.id} course={course} />
=======
          {coursesByStudent.map((course) => (
            <CourseProgressCard
              key={course._id}
              course={course}
              userId={user.user._id}
            />
>>>>>>> 8fab81122832fc3810b69e9175764009fd4ff559
          ))}
        </div> */}
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg border p-6 ">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-sm font-medium text-gray-500">{title}</h2>
      <div className="text-[#125ca6] text-xl">{icon}</div>
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
