import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { toPng } from "html-to-image";
import { useLocation, useNavigate } from "react-router-dom";
import certificateTemplate from "/certificate.png";
import useAuthContext from "../hooks/useAuthContext";

const Certificate = () => {
  const ref = useRef(null);
  const { user } = useAuthContext();

  const { state } = useLocation();
  const navigate = useNavigate();
  const { courseTitle, studentId } = state || {};

  if (!courseTitle) {
    navigate("/dashboard/user", { replace: true });
    return null;
  }

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  // const [score, setScore] = useState(0);

  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/course/getAllEnrolledCourse/${studentId}`
        );
        const data = await res.json();
        console.log("data", data);
        setCourses(data.courses || []);
      } catch (e) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [studentId, baseUrl]);

  const score = useMemo(() => {
    return (
      courses
        .find(
          (c) =>
            c.title?.trim().toLowerCase() === courseTitle.trim().toLowerCase()
        )
        ?.students?.find((s) => s.studentsId === studentId)?.quizMarks ?? 0
    );
  }, [courses, courseTitle, studentId]);
  console.log(score);
  const download = useCallback(() => {
    if (!ref.current) return;
    toPng(ref.current, { cacheBust: true }).then((dataUrl) => {
      const link = document.createElement("a");
      link.download = "certificate.png";
      link.href = dataUrl;
      link.click();
    });
  }, []);
  const percent = Math.max(0, Math.min(100, (score - 1) * 10));
  let currentDate = new Date().toJSON().slice(0, 10);
  if (loading) return <p className="text-center">Loading…</p>;

  return (
    <div className="flex flex-col items-center">
      <div ref={ref} className="relative h-[400px] w-[560px]">
        <img
          src={certificateTemplate}
          alt="certificate"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0">
          <h1 className="absolute top-[150px] left-[290px] text-xl font-bold font-sourceSansFont">
            {user?.user.firstname} {user?.user.lastname}
          </h1>
          <p className="absolute top-[215px] left-[320px] text-sm font-sourceSansFont">
            {courseTitle}
          </p>
          <p className="absolute top-[245px] left-[390px] text-sm font-sourceSansFont">
            {percent}%
          </p>
          <p className="absolute top-[330px] left-[155px] text-sm font-sourceSansFont">
            {currentDate}
          </p>
        </div>
      </div>

      <button
        onClick={download}
        className="mt-4 h-10 w-24 rounded bg-orange-500 text-white transition duration-300 hover:bg-orange-600"
      >
        Download
      </button>
    </div>
  );
};

export default Certificate;
