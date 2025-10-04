import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet"; // ✅ Import Helmet

const ScheduleMeet = () => {
  const [summary, setSummary] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [students, setStudents] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [meetLink, setMeetLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usersData, setUsersData] = useState([]);
  const location = useLocation();

  const id = location.search.slice(1);
  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;

  useEffect(() => {
    const fetchSingleCourse = async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/course/getSingleCourse/${id}`
        );
        if (data) {
          setStudents(data.students || []);
          setCourseTitle(data.title || "Unknown Course");
        } else {
          setError("Course data not found.");
        }
      } catch (err) {
        setError("Failed to fetch course details.");
        console.error("Error fetching course:", err);
      }
    };
    fetchSingleCourse();
  }, [id]);

  useEffect(() => {
    if (students.length === 0) return;

    const fetchUserEmails = async () => {
      try {
        const emails = await Promise.all(
          students.map(async (student) => {
            try {
              const { data } = await axios.get(
                `${baseUrl}/api/user/singleUser/${student?.studentsId}`
              );
              return { email: data?.email || "No Email" };
            } catch (err) {
              return { email: "Error Fetching Email" };
            }
          })
        );
        setUsersData(emails);
      } catch (err) {
        setError("Failed to fetch user emails.");
      }
    };

    fetchUserEmails();
  }, [students]);

  const createMeet = async () => {
    if (!summary || !startTime || !endTime) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(`${baseUrl}/api/meet/createMeet`, {
        summary,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });

      if (data?.meetLink) {
        setMeetLink(data.meetLink);

        if (usersData.length > 0 && courseTitle) {
          await axios.post(`${baseUrl}/api/meet/sendSchedule`, {
            usersData,
            meetLink: data.meetLink,
            courseTitle,
          });
        } else {
          setError("Missing users, course title, or meet link.");
        }
      } else {
        setError("Failed to create Google Meet event.");
      }
    } catch (err) {
      setError("Error creating Google Meet event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* ✅ Helmet for SEO and page title */}
      <Helmet>
        <title>Schedule Google Meet - Safara</title>
        <meta
          name="description"
          content="Schedule Google Meet sessions for your Safara courses and notify students via email."
        />
      </Helmet>

      <h1 className="text-2xl font-semibold pb-5">Schedule a Google Meet</h1>
      <div className="border border-primary p-5 rounded-lg lg:w-1/4 md:w-1/2 w-full">
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border w-full mb-3 p-2 rounded-md"
        />
        <input
          type="datetime-local"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border w-full mb-3 p-2 rounded-md"
        />
        <input
          type="text"
          placeholder="Event Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="border w-full mb-3 p-2 rounded-md"
        />
        <button
          className="btn bg-primary hover:bg-primary w-full text-white"
          onClick={createMeet}
          disabled={loading || !usersData.length || !courseTitle}
        >
          {loading ? "Creating..." : "Create Google Meet Event"}
        </button>
        {error && <div className="text-red-500 mt-3">{error}</div>}
        {meetLink && (
          <div className="mt-3">
            <h2 className="font-semibold">Google Meet Link:</h2>
            <a
              href={meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              {meetLink}
            </a>
            <h4>Meet schedule Created successfully!</h4>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleMeet;
