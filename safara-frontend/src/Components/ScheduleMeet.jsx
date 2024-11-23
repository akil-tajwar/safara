import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ScheduleMeet = () => {
  const [summary, setSummary] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [students, setStudents] = useState([]);
  const [courseTitle, setCourseTitle] = useState([]);
  const [meetLink, setMeetLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [usersData, setUsersData] = useState([]);
  const location = useLocation();

  // Extract the ID from the URL directly after '?' without key-value
  const id = location.search.slice(1); // Removes the '?' and gets the string

  // Fetch course and coursetitles data
  const fetchSingleCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/course/getSingleCourse/${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch course");
      }
      const data = await response.json();
      setStudents(data.students); // Store students data
      setCourseTitle(data.title)
    } catch (error) {
      console.error("Error fetching course:", error);
    }
  };
  useEffect(() => {
    fetchSingleCourse();
  }, []);
  console.log(students);
  // Fetch user emails from students data
  const fetchUserEmails = async () => {
    try {
      const userEmails = await Promise.all(
        students.map(async (student) => {
          const response = await fetch(
            `http://localhost:4000/api/user/singleUser/${student.studentsId}`
          );
          if (!response.ok) {

            throw new Error(
              `Failed to fetch user with ID: ${student.studentsId}`
            );
          }
          const userData = await response.json();
          return { email: userData.email }; // Returning email as part of the object
        })
      );
      setUsersData(userEmails); // Set the fetched emails
    } catch (error) {
      console.error("Error fetching user emails:", error);
      setError(error)
    }
  };

  useEffect(() => {
    if (students.length > 0) {
      fetchUserEmails();
    }
  }, [students]);

  // usersData.map((std) => console.log(std.email));
  // const arry = usersData.map(st);

  const createMeet = async () => {
    try {
      const response = axios.post(
        "http://localhost:4000/api/meet/createMeet",
        {
          summary,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        }
      );
      console.log(response.data);
      setMeetLink(response.data.meetLink);

      axios
      .post("http://localhost:4000/api/meet/sendSchedule", {
        usersData,
        meetLink,
        courseTitle,
      })
      .then((response) => {
        console.log("API Response:", response.data);
      })
      .catch((error) => {
        console.error("API Error:", error.message);
        if (error.response) {
          console.error("Error Response Data:", error.response.data);
          console.error("Error Status Code:", error.response.status);
        }
        setError(error)
      });
    
    } catch (error) {
      console.error("Error creating Google Meet event:", error);
      setError(error)
    }
  };

  return (
    <div>
      <h1>Schedule a Google Meet</h1>
      <div>
        <input
          type="text"
          placeholder="Event Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          className="border border-green-500"
        />
      </div>
      <div>
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border border-green-500"
        />
      </div>
      <div>
        <input
          type="datetime-local"
          placeholder="End Time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border border-green-500"
        />
      </div>
      <button
        className="btn bg-[#125ca6] text-white my-10"
        onClick={createMeet}
      >
        Create Google Meet Event
      </button>

      {meetLink && (
        <div>
          <h2>Google Meet Link:</h2>
          <a href={meetLink} target="_blank" rel="noopener noreferrer">
            {meetLink || error}
          </a>
        </div>
      )}
    </div>
  );
};

export default ScheduleMeet;
