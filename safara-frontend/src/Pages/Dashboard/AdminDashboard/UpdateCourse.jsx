import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import { RxCross2 } from "react-icons/rx";
import { storage } from "../../../firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useAuthContext from "../../../hooks/useAuthContext";

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
  const baseUrl = import.meta.env.VITE_MAHAD_baseUrl;
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

  // Handle input changes
  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    setDropdownVisible(value.length > 0);
  };

  const handleSuggestionClick = (instructor) => {
    if (
      !selectedInstructors.find((selected) => selected._id === instructor._id)
    ) {
      setSelectedInstructors([...selectedInstructors, instructor]);
    }
    setSearchTerm("");
    setDropdownVisible(false);
  };

  const handleRemoveInstructor = (id) => {
    setSelectedInstructors(
      selectedInstructors.filter((instructor) => instructor._id !== id)
    );
  };

  const handleAddVideo = (e) => {
    const videoFile = e.target.files[0];
    if (videoFile) {
      setSelectedVideos([
        ...selectedVideos,
        { videoTitle: videoFile.name, videoFile },
      ]);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() !== "") {
      setSelectedKeywords([...selectedKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleQuizChange = (quizIndex, field, value, optionIndex = null) => {
    const updatedQuizzes = [...quizzes];
    if (field === "option") {
      updatedQuizzes[quizIndex].options[optionIndex] = value;
    } else if (field === "selectedAnswer") {
      updatedQuizzes[quizIndex].selectedAnswer = value;
      updatedQuizzes[quizIndex].ans = parseInt(value);
    } else {
      updatedQuizzes[quizIndex][field] = value;
    }
    setQuizzes(updatedQuizzes);
  };

  const handleAddQuiz = () => {
    setQuizzes([
      ...quizzes,
      { ques: "", options: ["", "", "", ""], ans: "", selectedAnswer: "" },
    ]);
  };

  // Upload file to Firebase Storage
  const uploadFileToFirebase = (file, folder) => {
    return new Promise((resolve, reject) => {
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storageRef = ref(storage, `${folder}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setCompletedUploads((prev) => prev + 1);
          setUploadProgress(0); // Reset progress for next file
          resolve(downloadURL);
        }
      );
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const total =
      selectedVideos.filter((v) => v.videoFile).length +
      (bannerFile ? 1 : 0) +
      (pdfFile ? 1 : 0);
    setTotalFiles(total);
    setCompletedUploads(0);
    setUploadProgress(0);

    try {
      let bannerURL = "";
      let pdfURL = "";
      const videoURLs = [];

      if (bannerFile) {
        bannerURL = await uploadFileToFirebase(bannerFile, "images");
      }

      if (pdfFile) {
        pdfURL = await uploadFileToFirebase(pdfFile, "pdfs");
      }

      for (const video of selectedVideos) {
        if (video.videoFile) {
          const videoURL = await uploadFileToFirebase(
            video.videoFile,
            "videos"
          );
          videoURLs.push({ videoTitle: video.videoTitle, videoLink: videoURL });
        } else {
          videoURLs.push(video);
        }
      }

      const courseData = {
        userId: user?.user?._id,
        title: courseTitle,
        magnetLine: magnetLine,
        details: content,
        requirements,
        whatsappGroupLink,
        instructorsId: selectedInstructors.map((inst) => inst._id),
        ...(bannerURL && { banner: bannerURL }),
        ...(videoURLs.length > 0 && { videos: videoURLs }),
        category,
        subCategory,
        ...(pdfURL && { syllabus: pdfURL }),
        keywords: selectedKeywords,
        price,
        discount,
        quiz: quizzes.map((q) => ({
          ques: q.ques,
          options: q.options,
          ans: parseInt(q.selectedAnswer),
        })),
      };

      const response = await fetch(`${baseUrl}/api/course/updateCourse/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Course updated successfully:", data);
        navigate(`/singleCourse/${id}`);
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      console.error("Error updating course:", error);
      setError(error.message);
    } finally {
      setLoading(false);
      setUploadProgress(100);
    }
  };

  return (
    <div>
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
          <div className="flex md:flex-row flex-col justify-between gap-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Course Title</span>
              </label>
              <input
                type="text"
                name="courseTitle"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="Course Title"
                className="px-3 py-[11px] rounded-md border border-slate-200"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Magnet Line</span>
              </label>
              <input
                type="text"
                name="magnetLine"
                value={magnetLine}
                onChange={(e) => setMagnetLine(e.target.value)}
                placeholder="Magnet Line"
                className="px-3 py-[11px] rounded-md border border-slate-200"
              />
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-[11px] rounded-md cursor-pointer border border-slate-200"
              >
                <option disabled value="">
                  Select a category
                </option>
                <option>Qira'at Hafs</option>
                <option>Qira'at Saba</option>
                <option>Qira'at A'shara</option>
                <option>Muqaddamatul Jazari</option>
              </select>
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Sub category</span>
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="px-3 py-[11px] rounded-md cursor-pointer border border-slate-200"
              >
                <option disabled value="">
                  Select a sub-category
                </option>
                <option>Ḥafṣ ʿan ʿĀṣim – Ṭarīq ash-Shāṭibiyyah</option>
                <option>Ḥafṣ ʿan ʿĀṣim – Ṭarīq aṭ-Ṭayyibah</option>
                <option>Shuʿbah ʿan ʿĀṣim – Ṭarīq ash-Shāṭibiyyah</option>

                <option>Warsh ʿan Nāfiʿ – Ṭarīq al-Azraq</option>
                <option>Warsh ʿan Nāfiʿ – Ṭarīq al-Asbahani</option>
                <option>Qālūn ʿan Nāfiʿ – Ṭarīq ash-Shāṭibiyyah</option>

                <option>ad-Dūrī ʿan Abū ʿAmr – Ṭarīq ash-Shāṭibiyyah</option>
                <option>as-Sūsī ʿan Abū ʿAmr – Ṭarīq ash-Shāṭibiyyah</option>

                <option>al-Bazzī ʿan Ibn Kathīr – Ṭarīq ash-Shāṭibiyyah</option>
                <option>Qunbul ʿan Ibn Kathīr – Ṭarīq ash-Shāṭibiyyah</option>

                <option>Khalaf ʿan Ḥamzah – Ṭarīq ash-Shāṭibiyyah</option>
                <option>Khalād ʿan Ḥamzah – Ṭarīq ash-Shāṭibiyyah</option>

                <option>
                  Abū al-Ḥārith ʿan al-Kisāʾī – Ṭarīq ash-Shāṭibiyyah
                </option>
                <option>ad-Dūrī ʿan al-Kisāʾī – Ṭarīq ash-Shāṭibiyyah</option>

                <option>Ibn Wardan ʿan Abū Jaʿfar – Ṭarīq aṭ-Ṭayyibah</option>
                <option>Ibn Jammaz ʿan Abū Jaʿfar – Ṭarīq aṭ-Ṭayyibah</option>

                <option>Ruways ʿan Yaʿqūb – Ṭarīq aṭ-Ṭayyibah</option>
                <option>Rawḥ ʿan Yaʿqūb – Ṭarīq aṭ-Ṭayyibah</option>

                <option>Ishāq ʿan Khalaf al-ʿĀshir – Ṭarīq aṭ-Ṭayyibah</option>
                <option>Idrīs ʿan Khalaf al-ʿĀshir – Ṭarīq aṭ-Ṭayyibah</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between gap-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="px-3 py-[11px] rounded-md border border-slate-200"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Discount</span>
              </label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                placeholder="Discount"
                className="px-3 py-[11px] rounded-md border border-slate-200"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Course Details*</span>
            </label>
            <div className="custom-class -z-50 no-tailwind custom-ul custom-ol">
              <JoditEditor
                ref={editor}
                value={content}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>
          </div>

          <div className="flex md:flex-row flex-col justify-between gap-3">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Banner</span>
              </label>
              <input
                type="file"
                onChange={(e) => setBannerFile(e.target.files[0])}
                accept="image/*"
                className="file-input w-full file-input-bordered"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Syllabus</span>
              </label>
              <input
                type="file"
                onChange={(e) => setPdfFile(e.target.files[0])}
                accept="application/pdf"
                className="file-input w-full file-input-bordered"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-3">
            <div className="grid grid-cols-4 gap-3">
              <div className="form-control col-span-3 w-full">
                <label className="label">
                  <span className="label-text">Videos</span>
                </label>
                <input
                  type="file"
                  onChange={handleAddVideo}
                  accept="video/*"
                  className="file-input w-full file-input-bordered"
                />
              </div>

              <p className="border h-fit text-center rounded-md py-[11px] cursor-pointer bg-slate-200 mt-9">
                Add Video
              </p>

              <div className="border mt-3 h-44 col-span-4 overflow-y-scroll rounded-md p-3">
                <p className="text-center pb-3">Your selected videos</p>
                {selectedVideos.map((video, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-5 bg-slate-200 p-2 rounded-md mb-2"
                  >
                    <div className="flex gap-3">
                      <p>{index + 1}.</p>
                      <p>
                        {video.videoTitle.slice(0, 12)}.......
                        {video.videoTitle.slice(-8)}
                      </p>
                    </div>
                    <RxCross2
                      className="text-red-600 cursor-pointer"
                      onClick={() =>
                        setSelectedVideos(
                          selectedVideos.filter((_, i) => i !== index)
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="form-control w-full relative">
              <label className="label">
                <span className="label-text">Instructors</span>
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleInputChange}
                onFocus={() => setDropdownVisible(searchTerm.length > 0)}
                onBlur={() => setTimeout(() => setDropdownVisible(false), 100)}
                placeholder="Instructors"
                className="px-3 py-[11px] rounded-md border border-slate-200"
              />

              {dropdownVisible && (
                <ul className="absolute top-24 right-0 w-full bg-white text-black border border-gray-200 mt-1 z-10 rounded-md">
                  {selectInstructors
                    .filter((instructor) =>
                      `${instructor.firstname} ${instructor.lastname}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((instructor) => (
                      <li
                        key={instructor._id}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                        onMouseDown={() => handleSuggestionClick(instructor)}
                      >
                        <div className="flex gap-3 items-center">
                          <div className="avatar">
                            <div className="w-10 h-10 border rounded-md object-cover">
                              <img src={instructor.img} alt={instructor.img} />
                            </div>
                          </div>
                          <div>
                            <h5 className="font-semibold pb-2">
                              {instructor.firstname} {instructor.lastname}
                            </h5>
                          </div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
              <div className="border mt-6 h-44 col-span-4 overflow-y-scroll rounded-md p-3">
                <p className="text-center pb-3">Your selected instructors</p>
                {selectedInstructors.map((instructor, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center gap-5 bg-slate-200 p-2 rounded-md mb-2"
                  >
                    <div className="flex gap-3">
                      <p>{index + 1}.</p>
                      <p>
                        {instructor.firstname} {instructor.lastname}
                      </p>
                    </div>
                    <RxCross2
                      className="text-red-600 cursor-pointer"
                      onClick={() => handleRemoveInstructor(instructor._id)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:grid md:grid-cols-2 gap-3">
            <div className="grid md:grid-cols-4 grid-cols-1 gap-3">
              <div className="form-control col-span-3 w-full">
                <label className="label">
                  <span className="label-text">Keywords</span>
                </label>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Add a keyword"
                  className="px-3 py-[11px] rounded-md border border-slate-200"
                />
              </div>
              <p
                onClick={handleAddKeyword}
                className="border h-fit px-4 text-center rounded-md py-[11px] cursor-pointer bg-slate-200 mt-9"
              >
                Add Keyword
              </p>
              <div className="border mt-3 h-44 col-span-4 overflow-y-scroll rounded-md p-3">
                <p className="text-center pb-3">Your selected keywords</p>
                <div className="flex gap-3 flex-wrap">
                  {selectedKeywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex gap-5 w-fit items-center bg-slate-200 p-2 rounded-md mb-2"
                    >
                      <p>{keyword}</p>
                      <RxCross2
                        className="text-red-600 cursor-pointer"
                        onClick={() =>
                          setSelectedKeywords(
                            selectedKeywords.filter((_, i) => i !== index)
                          )
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Requirements</span>
                </label>
                <input
                  type="text"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Requirements"
                  className="px-3 py-[11px] rounded-md border border-slate-200"
                />
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Whatsapp Group Link</span>
                </label>
                <input
                  type="text"
                  value={whatsappGroupLink}
                  onChange={(e) => setWhatsappGroupLink(e.target.value)}
                  placeholder="Whatsapp Group Link"
                  className="px-3 py-[11px] rounded-md border border-slate-200"
                />
              </div>
            </div>
            <div className="col-span-2 mt-4">
              <h3 className="mb-2">Quizzes</h3>
              {quizzes.map((quiz, quizIndex) => (
                <div key={quizIndex} className="rounded-md pb-5">
                  <div className="flex gap-2 items-center">
                    <p>{quizIndex + 1}.</p>
                    <input
                      type="text"
                      value={quiz.ques}
                      onChange={(e) =>
                        handleQuizChange(quizIndex, "ques", e.target.value)
                      }
                      placeholder="Question"
                      className="w-full px-3 py-2 mb-2 rounded-md border border-slate-200"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    {quiz.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="radio"
                          id={`quiz-${quizIndex}-option-${optionIndex}`}
                          name={`quiz-${quizIndex}-answer`}
                          value={optionIndex}
                          checked={
                            quiz.selectedAnswer === optionIndex.toString()
                          }
                          onChange={(e) =>
                            handleQuizChange(
                              quizIndex,
                              "selectedAnswer",
                              e.target.value,
                              optionIndex
                            )
                          }
                          className="radio"
                        />
                        <label
                          htmlFor={`quiz-${quizIndex}-option-${optionIndex}`}
                          className="flex items-center gap-2 w-full"
                        >
                          <span>{String.fromCharCode(97 + optionIndex)}.</span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) =>
                              handleQuizChange(
                                quizIndex,
                                "option",
                                e.target.value,
                                optionIndex
                              )
                            }
                            placeholder={`Option ${String.fromCharCode(
                              97 + optionIndex
                            )}`}
                            className="w-full px-3 py-2 rounded-md border border-slate-200"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddQuiz}
                className="px-4 py-2 bg-slate-200 rounded-md mt-4"
              >
                Add More Quiz
              </button>
            </div>
          </div>

          <div className="pt-8 text-center">
            <button
              type="submit"
              className="rounded-md py-[11px] px-4 bg-primary text-white"
            >
              Update Course
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default UpdateCourse;
