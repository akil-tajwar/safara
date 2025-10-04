import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { RxCross2 } from "react-icons/rx";
import { storage } from "../../../firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useAuthContext from "../../../hooks/useAuthContext";
import { Helmet } from "react-helmet"; // ✅ Import Helmet

function UpdateCourse() {
  const { id } = useParams();
  const { user } = useAuthContext();
  const editor = useRef(null);
  const navigate = useNavigate();

  // Form state variables
  const [courseTitle, setCourseTitle] = useState("");
  const [magnetLine, setMagnetLine] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [requirements, setRequirements] = useState("");
  const [whatsappGroupLink, setWhatsappGroupLink] = useState("");
  const [content, setContent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectInstructors, setSelectInstructors] = useState([]);
  const [selectedInstructors, setSelectedInstructors] = useState([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [selectedVideos, setSelectedVideos] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [completedUploads, setCompletedUploads] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [error, setError] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const baseUrl = import.meta.env.VITE_SAFARA_baseUrl;

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/course/getSingleCourse/${id}`
        );
        if (response.ok) {
          const courseData = await response.json();
          setCourseTitle(courseData.title || "");
          setMagnetLine(courseData.magnetLine || "");
          setCategory(courseData.category || "");
          setSubCategory(courseData.subCategory || "");
          setPrice(courseData.price || "");
          setDiscount(courseData.discount || "");
          setRequirements(courseData.requirements || "");
          setWhatsappGroupLink(courseData.whatsappGroupLink || "");
          setContent(courseData.details || "");
          setSelectedVideos(courseData.videos || []);
          setSelectedKeywords(courseData.keywords || []);
          setQuizzes(
            courseData.quiz?.map((q) => ({
              ...q,
              selectedAnswer: q.ans.toString(),
            })) || []
          );

          if (courseData.instructorsId) {
            const instructors = courseData.instructorsId
              .map((instructorId) => {
                const instructor = selectInstructors.find(
                  (inst) => inst._id === instructorId
                );
                return instructor ? { ...instructor } : null;
              })
              .filter((inst) => inst !== null);
            setSelectedInstructors(instructors);
          }
        } else {
          console.error("Failed to fetch course data");
        }
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };

    fetchCourseData();
  }, [id, selectInstructors]);

  // Fetch instructors data
  useEffect(() => {
    const fetchAllUsers = () => {
      const url = `${baseUrl}/api/user/allUsers`;
      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          setSelectInstructors(data);
        })
        .catch((error) => console.log(error));
    };

    fetchAllUsers();
  }, []);

  // [All other functions remain the same: handleInputChange, handleSuggestionClick, handleRemoveInstructor, handleAddVideo, handleAddKeyword, handleQuizChange, handleAddQuiz, uploadFileToFirebase, handleSubmit...]

  return (
    <div>
      {/* ✅ Helmet for dynamic title and description */}
      <Helmet>
        <title>Update Course - {courseTitle || "Loading..."}</title>
        <meta
          name="description"
          content={`Update details for the course: ${
            courseTitle || ""
          }. Edit title, content, videos, quizzes, and more.`}
        />
      </Helmet>

      {loading ? (
        <div className="fixed inset-0 bg-white flex flex-col justify-center items-center">
          <h2 className="text-2xl font-semibold text-center">
            Please wait. Files are uploading and processing. <br /> This may
            take a while.
          </h2>
          <div className="w-64 h-6 bg-gray-200 rounded-full mt-4 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-gray-600">{Math.round(uploadProgress)}%</p>
          <p className="mt-2 text-gray-600">
            {completedUploads}/{totalFiles} files uploaded
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="lg:p-6 pt-6">
          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}
          {/* Form fields and UI remain exactly the same */}
          {/* ... */}
        </form>
      )}
    </div>
  );
}

export default UpdateCourse;
