import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { RxCross2 } from "react-icons/rx";
import { storage } from '../../../firebase/firebase'; // Adjust this import path as needed
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import useAuthContext from "../../../hooks/useAuthContext"; // Adjust this import path as needed

function UpdateCourse() {
    const { id } = useParams();
    console.log("🚀 ~ UpdateCourse ~ id:", id)
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
    const [content, setContent] = useState(''); // For course details
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectInstructors, setSelectInstructors] = useState([]);
    const [selectedInstructors, setSelectedInstructors] = useState([]);
    const [bannerFile, setBannerFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [selectedVideos, setSelectedVideos] = useState([]);
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const [keywordInput, setKeywordInput] = useState("");
    const [loading, setLoading] = useState(false); // Loading state for upload process
    const [uploadProgress, setUploadProgress] = useState(0); // Track the overall upload progress
    const [error, setError] = useState(''); // Add error state

    // Fetch course data
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`http://localhost:4000/api/course/getSingleCourse/${id}`);
                if (response.ok) {
                    const courseData = await response.json();
                    // Populate all form fields with existing data
                    setCourseTitle(courseData.title || '');
                    setMagnetLine(courseData.magnetLine || '');
                    setCategory(courseData.category || '');
                    setSubCategory(courseData.subCategory || '');
                    setPrice(courseData.price || '');
                    setDiscount(courseData.discount || '');
                    setRequirements(courseData.requirements || '');
                    setContent(courseData.details || '');

                    // Ensure the instructors are correctly set
                    if (courseData.instructorsId) {
                        // Assuming instructors are fetched separately and their data includes both _id and name
                        const instructors = courseData.instructorsId.map(instructorId => {
                            const instructor = selectInstructors.find(inst => inst._id === instructorId);
                            return instructor ? { ...instructor } : null; // Safeguard in case instructor data is missing
                        }).filter(inst => inst !== null); // Filter out null values
                        setSelectedInstructors(instructors);
                    }

                    setSelectedVideos(courseData.videos || []);
                    setSelectedKeywords(courseData.keywords || []);
                } else {
                    console.error("Failed to fetch course data");
                }
            } catch (error) {
                console.error("Error fetching course data:", error);
            }
        };

        fetchCourseData();
    }, [id, selectInstructors]);  // Make sure `selectInstructors` is part of dependencies


    // Fetch instructors data
    useEffect(() => {
        const fetchAllUsers = () => {
            const url = `http://localhost:4000/api/user/allUsers`;
            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    setSelectInstructors(data);
                })
                .catch((error) => console.log(error));
        };

        fetchAllUsers();
    }, []);

    // Handle search input change
    const handleInputChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        setDropdownVisible(value.length > 0);
    };

    // Handle suggestion click for instructors
    const handleSuggestionClick = (instructor) => {
        if (!selectedInstructors.find((selected) => selected._id === instructor._id)) {
            setSelectedInstructors([...selectedInstructors, instructor]);
        }
        setSearchTerm("");
        setDropdownVisible(false);
    };

    // Handle removing instructor from selected instructors
    const handleRemoveInstructor = (id) => {
        setSelectedInstructors(selectedInstructors.filter((instructor) => instructor._id !== id));
    };

    // Handle video addition
    const handleAddVideo = (e) => {
        const videoFile = e.target.files[0];
        if (videoFile) {
            setSelectedVideos([...selectedVideos, { videoTitle: videoFile.name, videoFile }]);
        }
    };

    // Handle keyword addition
    const handleAddKeyword = () => {
        if (keywordInput.trim() !== "") {
            setSelectedKeywords([...selectedKeywords, keywordInput.trim()]);
            setKeywordInput("");
        }
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
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress((prevProgress) => {
                        const newProgress = prevProgress + (progress / totalFiles); // Adjust total progress
                        return Math.min(newProgress, 100); // Ensure it doesn't exceed 100%
                    });
                },
                (error) => reject(error),
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                }
            );
        });
    };

    // Handle form submission
    let totalFiles = 0;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); // Clear any previous errors

        totalFiles = selectedVideos.length + (bannerFile ? 1 : 0) + (pdfFile ? 1 : 0);
        setUploadProgress(0); // Reset progress to 0

        try {
            let bannerURL = "";
            let pdfURL = "";
            const videoURLs = [];

            // Upload banner to Firebase if a new file is selected
            if (bannerFile) {
                bannerURL = await uploadFileToFirebase(bannerFile, 'images');
            }

            // Upload PDF to Firebase if a new file is selected
            if (pdfFile) {
                pdfURL = await uploadFileToFirebase(pdfFile, 'pdfs');
            }

            // Handle videos
            for (const video of selectedVideos) {
                if (video.videoFile) {
                    const videoURL = await uploadFileToFirebase(video.videoFile, 'videos');
                    videoURLs.push({ videoTitle: video.videoTitle, videoLink: videoURL });
                } else {
                    videoURLs.push(video); // Keep existing video data
                }
            }

            const courseData = {
                userId: user?.user?._id,
                title: courseTitle,
                magnetLine: magnetLine,
                details: content,
                requirements,
                instructorsId: selectedInstructors.map(inst => inst._id),
                ...(bannerURL && { banner: bannerURL }), // Only include if new file uploaded
                ...(videoURLs.length > 0 && { videos: videoURLs }),
                category,
                subCategory,
                ...(pdfURL && { syllabus: pdfURL }), // Only include if new file uploaded
                keywords: selectedKeywords,
                price,
                discount,
            };

            const response = await fetch(`http://localhost:4000/api/course/updateCourse/${id}`, {
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
            setError(error.message); // Set error message from API response
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
                        Please wait. Files are uploading. <br /> This may take a while.
                    </h2>
                    <input
                        type="range"
                        value={uploadProgress}
                        max="100"
                        className="w-64 mt-4"
                        readOnly
                    />
                    <p className="mt-2 text-gray-600">{Math.round(uploadProgress)}%</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="card-body">
                    {error && ( // Add error display
                        <div className="text-red-500 text-center mb-4">
                            {error}
                        </div>
                    )}
                    <div className="flex justify-between gap-3">
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
                                <option disabled>Select a category</option>
                                <option>Web Development</option>
                                <option>C++</option>
                                <option>Python</option>
                                <option>Sharpe</option>
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
                                <option disabled>Select a sub-category</option>
                                <option>Web Development</option>
                                <option>C++</option>
                                <option>Python</option>
                                <option>Sharpe</option>
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
                        <div className="custom-class no-tailwind custom-ul custom-ol">
                            <JoditEditor ref={editor} value={content} onChange={newContent => setContent(newContent)} />
                        </div>
                    </div>

                    <div className="flex justify-between gap-3">
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Banner</span>
                            </label>
                            <input type="file" onChange={(e) => setBannerFile(e.target.files[0])} accept="image/*" className="file-input w-full file-input-bordered" />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Syllabus</span>
                            </label>
                            <input type="file" onChange={(e) => setPdfFile(e.target.files[0])} accept="application/pdf" className="file-input w-full file-input-bordered" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid grid-cols-4 gap-3">
                            <div className="form-control col-span-3 w-full">
                                <label className="label">
                                    <span className="label-text">Videos</span>
                                </label>
                                <input type="file" onChange={handleAddVideo} accept="video/*" className="file-input w-full file-input-bordered" />
                            </div>

                            <p className="border h-fit text-center rounded-md py-[11px] cursor-pointer bg-slate-200 mt-9">Add Video</p>

                            <div className="border mt-3 h-44 col-span-4 overflow-y-scroll rounded-md p-3">
                                <p className="text-center pb-3">Your selected videos</p>
                                {selectedVideos.map((video, index) => (
                                    <div key={index} className="flex justify-between items-center gap-5 bg-slate-200 p-2 rounded-md mb-2">
                                        <div className="flex gap-3">
                                            <p>{index + 1}.</p>
                                            <p>
                                                {video.videoTitle.slice(0, 12)}.......
                                                {video.videoTitle.slice(-8)}
                                            </p>
                                        </div>
                                        <RxCross2 className="text-red-600 cursor-pointer" onClick={() => setSelectedVideos(selectedVideos.filter((_, i) => i !== index))} />
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
                                            `${instructor.firstname} ${instructor.lastname}`.toLowerCase().includes(searchTerm.toLowerCase())
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
                                    <div key={index} className="flex justify-between items-center gap-5 bg-slate-200 p-2 rounded-md mb-2">
                                        <div className="flex gap-3">
                                            <p>{index + 1}.</p>
                                            <p>{instructor.firstname} {instructor.lastname}</p> {/* Make sure both names are displayed */}
                                        </div>
                                        <RxCross2 className="text-red-600 cursor-pointer" onClick={() => handleRemoveInstructor(instructor._id)} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="grid grid-cols-4 gap-3">
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
                            <p onClick={handleAddKeyword} className="border h-fit text-center rounded-md py-[11px] cursor-pointer bg-slate-200 mt-9">
                                Add Keyword
                            </p>

                            <div className="border mt-3 h-44 col-span-4 overflow-y-scroll rounded-md p-3">
                                <p className="text-center pb-3">Your selected keywords</p>
                                <div className="flex gap-3 flex-wrap">
                                    {selectedKeywords.map((keyword, index) => (
                                        <div key={index} className="flex gap-5 w-fit items-center bg-slate-200 p-2 rounded-md mb-2">
                                            <p>{keyword}</p>
                                            <RxCross2 className="text-red-600 cursor-pointer" onClick={() => setSelectedKeywords(selectedKeywords.filter((_, i) => i !== index))} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Requirements</span>
                            </label>
                            <input type="text" value={requirements} onChange={(e) => setRequirements(e.target.value)} placeholder="Requirements" className="px-3 py-[11px] rounded-md border border-slate-200" />
                        </div>
                    </div>

                    <div className="pt-8 text-center">
                        <button type="submit" className="rounded-md py-[11px] px-4 bg-[#125ca6] text-white">
                            Update Course
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default UpdateCourse;