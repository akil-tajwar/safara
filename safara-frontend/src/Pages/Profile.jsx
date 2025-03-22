import useAuthContext from "../hooks/useAuthContext";
import { MdEdit, MdPerson } from "react-icons/md";
import { FaMedal } from "react-icons/fa";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const baseUrl= import.meta.env.VITE_BASE_URL;
  const fetchSingleUser = () => {
    const url = `${baseUrl}/api/user/singleUser/${user?.user?._id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((error) => console.log(error));
  };

  const fetchEnrolledCourses = () => {
    const url = `${baseUrl}/api/course/getAllEnrolledCourse/${user?.user?._id}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setEnrolledCourses(data.courses))
      .catch((error) => console.log(error));
  };

  console.log("enrolledCourses", enrolledCourses); // enrolledCourses.map(courses=> courses.students.map(student=> if(studentsId===user.user._id && isCourseComplete===true)))

  useEffect(() => {
    if (user?.user?._id) {
      fetchSingleUser();
      fetchEnrolledCourses();
    }
  }, [user?.user?._id]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:w-3/4 w-11/12 mx-auto">
      <div className="grid md:grid-cols-7 grid-cols-1 gap-8">
        <div className="md:col-span-3 lg:col-span-2 col-span-7">
          <img
            className="h-[400px] rounded-md w-full object-cover object-top border"
            src={userData.img && userData.img}
            alt=""
          />
          <div className="block md:hidden">
            <div className="flex justify-between items-center pt-5">
              <h3 className="text-3xl font-semibold">
                {userData.firstname} {userData.lastname}
              </h3>
              <Link to={"/updateProfile"}>
                <MdEdit className="text-3xl bg-primary text-white rounded-full p-1" />
              </Link>
            </div>
            <p className="text-xl">{userData.profession[0]?.position}</p>
          </div>
          <div className="py-5">
            <p className="font-semibold text-xs text-slate-400 pb-1">
              PROFESSIONAL INFO
            </p>
            <p>{userData.institution}</p>
            <p>{userData.profession[0]?.position}</p>
          </div>
          <div className="py-5">
            <p className="font-semibold text-xs text-slate-400 pb-1">
              EDUCATIONAL HISTORY
            </p>
            <p>{userData.degree}</p>
            <p>{userData.result}</p>
          </div>
        </div>
        <div className="md:col-span-4 lg:col-span-5 col-span-7">
          <div className="border-b pb-1">
            <div className="md:block hidden">
              <div className="flex justify-between items-center">
                <h3 className="text-3xl font-semibold">
                  {userData.firstname} {userData.lastname}
                </h3>
                <Link to={"/updateProfile"}>
                  <MdEdit className="text-3xl bg-primary text-white rounded-full p-1" />
                </Link>
              </div>
              <p className="text-xl">{userData.profession[0]?.position}</p>
            </div>
            <div className="pt-7 flex gap-8">
              <p
                className={`flex gap-1 items-center cursor-pointer ${
                  activeTab === 0 && "text-primary"
                }`}
                onClick={() => setActiveTab(0)}
              >
                <MdPerson className="text-xl" /> <span>About</span>
              </p>
              <p
                className={`flex gap-1 items-center cursor-pointer ${
                  activeTab === 1 && "text-primary"
                }`}
                onClick={() => setActiveTab(1)}
              >
                <FaMedal /> <span>Certificates</span>
              </p>
            </div>
          </div>
          {activeTab === 0 && (
            <div>
              <div className="py-5 mt-5">
                <p className="font-semibold text-slate-400 pb-2 text-xs">
                  CONTACT INFO
                </p>
                <div className="grid grid-cols-5">
                  <p>Phone</p>
                  <p className="col-span-4">{userData.phone}</p>
                </div>
                <div className="grid grid-cols-5 py-2">
                  <p>Address</p>
                  <p className="col-span-4">{userData.location}</p>
                </div>
                <div className="grid grid-cols-5">
                  <p>Email</p>
                  <p className="col-span-4">{userData.email}</p>
                </div>
              </div>
              <div className="py-5">
                <p className="font-semibold text-slate-400 pb-2 text-xs">
                  PERSONAL INFO
                </p>
                <div className="grid grid-cols-5">
                  <p>Birthday</p>
                  <p className="col-span-4">{userData.birthday}</p>
                </div>
                <div className="grid grid-cols-5 py-2">
                  <p>Gender</p>
                  <p className="col-span-4">{userData.gender}</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              {enrolledCourses?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                  {enrolledCourses.map((course) => {
                    // Check if the logged-in user has completed the course
                    const isUserCompleted = course.students.some(
                      (student) =>
                        student.studentsId === user.user._id &&
                        student.isCourseComplete &&
                        student.isQuizComplete
                    );

                    return (
                      <div
                        key={course._id}
                        className="bg-white border border-gray-200 rounded-lg shadow-md p-4"
                      >
                        <img
                          src={course.banner}
                          className="h-32 min-w-full object-cover"
                          alt=""
                        />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          <strong>Category:</strong> {course.category}
                        </p>
                        {isUserCompleted ? (
                          <Link
                            to={{
                              pathname: "/dashboard/user/userCertificate",
                            }}
                            state={{ courseTitle: course.title }}
                            className="btn bg-primary text-white"
                          >
                            Download Certificate
                          </Link>
                        ) : (
                          <p className="text-gray-500">
                            Please Complete Your Course
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <h4 className="text-xl flex justify-center items-center pt-32">
                  You are not enrolled in any course; thus, no certificate is
                  available.
                </h4>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
