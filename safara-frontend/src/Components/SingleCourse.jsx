import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState } from "react";

const SingleCourse = () => {
    const { id } = useParams();
    const [courseData, setCourseData] = useState([])
    const fetchSingleCourse = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/course/getSingleCourse/${id}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch regions");
            }
            const data = await response.json();
            setCourseData(data);
            console.log('asdk', data);
        } catch (error) {
            console.error("Error fetching regions:", error);
        }
    };

    useState(() => {
        fetchSingleCourse();
    }, []);

    return (
        <div className="flex">
            <div className="fixed top-0">
                <Sidebar />
            </div>
            <div className="pl-72 top-7 absolute">
                askdf
            </div>
        </div>
    );
};

export default SingleCourse;