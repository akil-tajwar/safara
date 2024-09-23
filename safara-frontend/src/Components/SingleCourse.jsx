import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { IoMdDownload } from "react-icons/io";

const SingleCourse = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null); // State to track selected video

    const fetchSingleCourse = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/course/getSingleCourse/${id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch course");
            }
            const data = await response.json();
            setCourseData(data);
            setSelectedVideo(data.videos[0]); // Set the first video as default
        } catch (error) {
            console.error("Error fetching course:", error);
        }
    };

    useEffect(() => {
        fetchSingleCourse();
    }, []);

    const handleVideoSelect = (video) => {
        setSelectedVideo(video); // Update selected video
    };

    return (
        <div className="flex">
            <div className="fixed top-0 z-10">
                <Sidebar />
            </div>
            <div className="pl-72 top-7 absolute pr-8">
                <div className="border-b pb-2 mb-8 flex justify-between items-center">
                    <h3 className="text-2xl">{courseData?.title}</h3>
                    <button className="bg-[#125ca6] flex items-center gap-2 text-white py-2 px-4 rounded-md">
                        <IoMdDownload className="text-xl"/>
                        <p className="">Syllabus</p>
                    </button>
                </div>
                <div className=" grid grid-cols-7 gap-8">
                    <video
                        className="border rounded-md col-span-5 w-full h-[500px]"
                        src={selectedVideo?.videoLink} // Display the selected video
                        controls // Add controls for play/pause
                    />
                    <div className="col-span-2 border rounded-md">
                        {courseData?.videos?.map((video, index) => (
                            <p
                                key={video?._id}
                                className={`whitespace-nowrap m-3 p-2 rounded-md border ${selectedVideo?._id === video._id ? 'bg-[#125ca6] border-[#125ca6] text-white' : 'text-black'} overflow-hidden cursor-pointer`}
                                onClick={() => handleVideoSelect(video)} // Update video on click
                            >
                                {index + 1}. {video?.videoTitle}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleCourse;
