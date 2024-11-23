import { Link, useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useState, useEffect, useRef } from "react";
import { IoMdDownload } from "react-icons/io";
import {
  FaChevronLeft,
  FaChevronRight,
  FaRegStar,
  FaRegStarHalf,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import Navbar from "./Navbar";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { GoNote } from "react-icons/go";
import { TbLivePhoto } from "react-icons/tb";
import Footer from "./Footer";
import { FaRegCirclePlay } from "react-icons/fa6";
import useAuthContext from "../hooks/useAuthContext";
import Swal from "sweetalert2";
import axios from 'axios';

const SingleCourse = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [fetched, setFetched] = useState(false);
  const [courseData, setCourseData] = useState([]);
  const [reletedCourses, setreletedCourses] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null); // State to track selected video
  const [isAdminOrStudent, setIsAdminOrStudent] = useState(false);
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState("");
  const userId = user?.user?._id; // Replace with the actual user ID from your authentication

  //   syllabus dowload

  const downloadFiteAtURL = (url) => {
    // Extract the filename from the URL
    const fileName = url?.split("/").pop().split("?")[0]; // Removes query params like '?alt=media'

    // Create an invisible <a> element
    const aTag = document.createElement("a");
    aTag.href = url;

    // Set the download attribute to force download
    aTag.setAttribute("download", fileName);

    // Programmatically trigger a click on the <a> element
    document.body.appendChild(aTag);
    aTag.click();

    // Remove the <a> element from the DOM after the click
    aTag.remove();
  };


  const handleRatingClick = (rate) => {
    setRating(rate);
  };

  const handleSubmitRating = async () => {
    const url = `http://localhost:4000/api/course/giveRating/${courseData._id}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewerId: userId,
          rating: rating.toString(), // Ensure the rating is a string as per your model
          comments,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        // Check if the error is due to multiple reviews
        if (data.message === "An user cannot give multiple reviews") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
          });
        } else {
          throw new Error("Failed to submit rating");
        }
      } else {
        const data = await response.json();
        console.log("Rating submitted successfully", data);
        Swal.fire({
          icon: "success",
          title: "Thank You",
          text: "Your review is submitted successfully",
        });
        fetchSingleCourse();
        // Optionally, update the local state or re-fetch course data to reflect the new rating
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

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
  console.log("pdf link", courseData.syllabus);

  const fetchreletedCourses = () => {
    const url = `http://localhost:4000/api/course/getAllCourses`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched All Courses:", data);
        console.log("Current Course Keywords:", courseData?.keywords);
        const courseKeywords = courseData?.keywords?.map((keyword) =>
          keyword?.toLowerCase().trim()
        );
        const filteredCourses = data?.filter((course) =>
          course?.keywords?.some((keyword) =>
            courseKeywords?.includes(keyword?.toLowerCase().trim())
          )
        );
        setreletedCourses(filteredCourses);
        console.log("Filtered Courses:", filteredCourses);
      })
      .catch((error) => console.log(error));
  };

  const fetchAllUsers = () => {
    const url = `http://localhost:4000/api/user/allUsers`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAllUsers(data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchSingleCourse();
    fetchAllUsers(); // You can fetch users as well if needed.
  }, [id]); // Add `id` as a dependency

  useEffect(() => {
    if (courseData && courseData.videos && !selectedVideo) {
      setSelectedVideo(courseData.videos[0]); // Set the first video only if no video is currently selected
    }
    if (courseData && courseData.keywords) {
      fetchreletedCourses();
    }
  }, [courseData]); // Now this effect will run only once when courseData is set for the first time.

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    window.scrollTo({
      top: 0,
      behavior: "smooth", // This adds a smooth scrolling effect
    });
  };

  // Refs for the carousels
  const studentsOpinionCarouselRef = useRef(null);
  const reletedCoursesCarouselRef = useRef(null);

  // Function to handle scroll for any carousel
  const scrollCarousel = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -200 : 200, // Adjust scroll amount as needed
        behavior: "smooth",
      });
    }
  };

  const calculateAverageRating = () => {
    if (
      !courseData?.studentsOpinion ||
      courseData.studentsOpinion.length === 0
    ) {
      return 0;
    }

    const totalRating = courseData?.studentsOpinion?.reduce(
      (acc, opinion) => acc + parseInt(opinion.rating),
      0
    );
    console.log("🚀 ~ calculateAverageRating ~ totalRating:", totalRating);

    const averageRating = totalRating / courseData.studentsOpinion.length;
    console.log("🚀 ~ calculateAverageRating ~ averageRating:", averageRating);

    return parseFloat(averageRating.toFixed(1));
  };

  const renderStars = (averageRating) => {
    const stars = [];
    const fullStars = Math.floor(averageRating); // Number of full stars
    const halfStar = averageRating % 1 >= 0.25 && averageRating % 1 < 0.75; // Check for half star between 0.25 and 0.75
    const emptyStars = 5 - Math.ceil(averageRating); // Remaining empty stars

    // Render full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    }

    // Render half star if applicable
    if (halfStar) {
      stars.push(<FaStarHalfAlt key={fullStars} className="text-yellow-400" />);
    }

    // Render empty stars
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FaRegStar key={fullStars + i + 1} className="text-yellow-400" />
      );
    }

    return stars;
  };

  const tempEnrollBtn = () => {
    setIsAdminOrStudent(true);
  };

  const makePayment = async () => {
    const paymentData = {
      courseId: courseData._id,  // The course being enrolled in
      studentsId: userId,        // ID of the currently logged-in user
      price: courseData.price,   // Price of the course
    };
    console.log('Payment Data before sent:', paymentData);

    // Make a POST request to the backend payment API
    fetch('http://localhost:4000/api/course/payment/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    })
      .then(res => res.json())
      .then((result) => {
        window.location.replace(result.url); // Redirect to payment gateway
        console.log(result);
      })
      .catch(error => console.error('Error during payment process:', error));
  };


  const commonSections = (
    <div>
      <div>
        <h3 className="text-2xl font-semibold">What we offer</h3>
        <div className="border rounded-md mt-2 py-3 px-4">
          <div className="flex gap-3 items-center">
            <MdOutlineSlowMotionVideo />
            <p>{courseData?.videos?.length} videos</p>
          </div>
          <div className="flex gap-3 items-center">
            <GoNote />
            <p>Free certificate after completing the course</p>
          </div>
          <div className="flex gap-3 items-center">
            <TbLivePhoto />
            <p>Live classes</p>
          </div>
        </div>
      </div>
      <div className="pt-10">
        <h3 className="text-2xl font-semibold">Course Instructors</h3>
        <div className="border rounded-md mt-2 py-3 px-4 flex flex-col gap-3">
          {courseData?.instructorsId?.map((instructorId, index) => {
            const instructor = allUsers.find(
              (user) => user._id === instructorId
            );
            return (
              <div key={index}>
                <div className="flex gap-3 items-center">
                  <div className="w-20 rounded-full border mt-1">
                    <img
                      className="w-20 h-20 object-top rounded-full object-cover"
                      alt="Profile Picture"
                      src={instructor?.img}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold pb-2">
                      {instructor?.firstname} {instructor?.lastname}
                    </h3>
                    <p>Teacher, Businessman</p>
                    <p>Former Lecturer at IIUC</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pt-10">
        <h3 className="text-2xl font-semibold">Course Details</h3>
        <div className="border rounded-md mt-2 py-3 px-4">
          <p className="text-justify">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Reprehenderit rerum eaque unde autem soluta? Dolorum porro fuga
            quasi, laboriosam soluta eum, aspernatur, illum laborum mollitia
            consequuntur reprehenderit voluptatem veniam delectus quo?
            Repellendus, et ut non cum quis officia vel, aspernatur quod
            nesciunt consequuntur, minus aliquid doloribus voluptatem ipsum.
            Nobis totam dolores at, aut necessitatibus libero obcaecati
            laboriosam autem eveniet cum labore ipsa deserunt quidem rerum
            beatae asperiores sunt nostrum odio? Aut voluptate dicta nesciunt
            iusto. Necessitatibus omnis dolorem quasi aut.
          </p>
          <Link to={`/dashboard/admin/schedulemeet?${id}`} className="btn btn-primary">Create Meet</Link>
        </div>
      </div>
      <div className="pt-10">
        <h3 className="text-2xl font-semibold">Course Contents</h3>
        <div className="border rounded-md mt-2 py-3 px-4 max-h-72 overflow-y-scroll overflow-x-hidden">
          {courseData?.videos?.map((video, index) => (
            <div
              key={video?._id}
              className="whitespace-nowrap flex gap-2 items-center"
            >
              <FaRegCirclePlay /> <p>{video?.videoTitle}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-10">
        <h3 className="text-2xl font-semibold">Course Requirements</h3>
        <div className="border rounded-md mt-2 py-3 px-4">
          <p className="text-justify">{courseData?.requirements}</p>
        </div>
      </div>
      {isAdminOrStudent && (
        <div className="pt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold pb-2">
              Give us your valuable opinion
            </h3>
            <div className="flex gap-1 items-center cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <div key={star} onClick={() => handleRatingClick(star)}>
                  {rating >= star ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <textarea
              className="border rounded-md w-full h-32 p-2"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            ></textarea>
            <div className="text-right">
              <button
                onClick={handleSubmitRating}
                className="bg-[#125ca6] text-white px-5 py-2 mt-1 rounded-md"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="pt-10">
        {" "}
        {/*other students opinion. now user should see others opinion. if database  has 1, user should see one star. if database has 2 user should see 2 star. if database has 3, user should see 3 star. if database has 4, user should see 4 star. if database has 5, user should see 5 star. i has reviewer id. now show me dynamic data. */}
        <div className="flex gap-2 items-center justify-between">
          <h3 className="text-2xl font-semibold">Students Opinion</h3>
          <div className="flex gap-2 text-2xl text-white">
            <FaChevronLeft
              onClick={() => scrollCarousel(studentsOpinionCarouselRef, "left")}
              className="bg-[#125ca6] rounded-md p-1 cursor-pointer"
            />
            <FaChevronRight
              onClick={() =>
                scrollCarousel(studentsOpinionCarouselRef, "right")
              }
              className="bg-[#125ca6] rounded-md p-1 cursor-pointer"
            />
          </div>
        </div>
        <div
          ref={studentsOpinionCarouselRef}
          className="carousel carousel-center space-x-4 p-4 mt-2 border w-full rounded-md"
        >
          {courseData?.studentsOpinion?.map((opinion, index) => {
            const reviewer = allUsers.find(
              (user) => user._id === opinion.reviewerId
            );
            return (
              <div
                key={index}
                className="border rounded-md py-3 px-4 w-[490px]"
              >
                <div className="flex gap-3">
                  <div className="w-20 rounded-full border mt-1">
                    <img
                      className="w-20 h-20 object-top rounded-full object-cover"
                      alt="Profile Picture"
                      src={reviewer?.img}
                    />
                  </div>
                  <div>
                    <h5 className="font-semibold text-xl">
                      {reviewer?.firstname} {reviewer?.lastname}
                    </h5>
                    <p>Student</p>
                    <p>{reviewer?.department || "Department Unknown"}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-2 mb-5 items-center">
                  {[...Array(5)].map((star, i) =>
                    i < opinion.rating ? (
                      <FaStar key={i} className="text-yellow-400" />
                    ) : (
                      <FaRegStar key={i} />
                    )
                  )}
                </div>
                <p>{opinion.comments}</p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pt-10">
        <div className="flex gap-2 justify-between items-center">
          <h3 className="text-2xl font-semibold">Releted Courses</h3>
          <div className="flex gap-2 text-2xl text-white">
            <FaChevronLeft className="bg-[#125ca6] rounded-md p-1 cursor-pointer" />
            <FaChevronRight className="bg-[#125ca6] rounded-md p-1 cursor-pointer" />
          </div>
        </div>
        <div className="border rounded-md mt-2 py-3 px-4">
          <div className="carousel carousel-center max-w-md space-x-4">
            {reletedCourses?.map((reletedCourse) => (
              <Link
                to={`/singleCourse/${reletedCourse?._id}`}
                key={reletedCourse._id}
                className="carousel-item"
              >
                <img
                  src={reletedCourse?.banner}
                  className="rounded-md w-32 h-auto object-cover"
                  alt={reletedCourse?.title}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {isAdminOrStudent === false && (
        <div>
          <Navbar />
          <div className="pt-[73px] pb-20">
            <div className="rounded-md bg-gradient-to-b from-[#125ca6] via-[#1870c8] to-[#1c7edf] text-white py-10 border-b mb-8">
              <div className="w-3/4 mx-auto">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-3xl font-semibold">
                      {courseData?.title}
                    </h3>
                    <div className="flex gap-1 text-xl mt-2 items-center">
                      {renderStars(calculateAverageRating())}
                      {/* <p>{calculateAverageRating()}</p> */}
                      <p className="ml-3">
                        {courseData?.studentsOpinion?.length || 0} Ratings
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={()=>downloadFiteAtURL(courseData.syllabus)}
                    className="text-[#125ca6] flex items-center gap-2 bg-white py-2 px-4 rounded-md"
                  >
                    <IoMdDownload className="text-xl" />
                    <p className="">Syllabus</p>
                  </button>
                </div>
                <div>
                  <p className="pt-5 w-2/3">{courseData?.magnetLine}</p>
                </div>
              </div>
            </div>
            <div className="w-3/4 mx-auto">
              <div className=" grid grid-cols-7 gap-8 relative">
                <div className="col-span-5">{commonSections}</div>
                <div className="col-span-2 border rounded-md h-fit sticky top-[73px]">
                  <img className="" src={courseData?.banner} alt="" />
                  <div className="p-3">
                    <del className="font-semibold">৳{courseData?.price}</del>
                    <h3 className="text-2xl font-semibold">
                      ৳{courseData?.price}
                    </h3>
                    <button
                      // onClick={tempEnrollBtn}
                      onClick={makePayment}
                      target="_blank"
                      className="bg-[#125ca6] text-white w-full text-xl py-2 mt-2 rounded-md"
                    >
                      Enroll
                    </button>
                    {/* <dialog id="my_modal_2" className="modal">
                      <div className="modal-box">
                        <h3 className="text-2xl font-semibold text-center">Choose a payment method</h3>
                        <div className="grid grid-cols-2 gap-5 pt-5">
                          <img onClick={bkashPayment} className="border rounded-md cursor-pointer hover:border-[#125ca6]" src="/bkash.png" alt="" />
                          <img className="border rounded-md cursor-pointer hover:border-[#125ca6]" src="/nagad.png" alt="" />
                        </div>
                      </div>
                      <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                      </form>
                    </dialog> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
      {isAdminOrStudent === true && (
        <div className="flex">
          <div className="fixed top-0 z-10">
            <Sidebar />
          </div>
          <div className="pl-72 top-7 absolute pr-8">
            <div className="rounded-md bg-gradient-to-b from-[#125ca6] via-[#1870c8] to-[#1c7edf] text-white px-5 py-5 border-b mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-3xl">{courseData?.title}</h3>
                  <div className="flex gap-1 text-xl mt-2 items-center">
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaStar className="text-yellow-400" />
                    <FaRegStar />
                    <FaRegStar />
                    <p>(23)</p>
                  </div>
                </div>
                <button className="text-[#125ca6] flex items-center gap-2 bg-white py-2 px-4 rounded-md">
                  <IoMdDownload className="text-xl" />
                  <p className="">Syllabus</p>
                </button>
              </div>
              <div>
                <p className="pt-5 w-2/3">{courseData?.magnetLine}</p>
              </div>
            </div>
            <div className=" grid grid-cols-7 gap-8">
              <div className="col-span-5 w-full">
                <video
                  className="border rounded-md col-span-5 w-full h-[600px]"
                  src={selectedVideo?.videoLink} // Display the selected video
                  controls // Add controls for play/pause
                />
                <div className="py-10">{commonSections}</div>
              </div>
              <div className="col-span-2 border rounded-md h-[600px] sticky top-[20px]">
                {courseData?.videos?.map((video, index) => (
                  <p
                    key={video?._id}
                    className={`whitespace-nowrap m-3 p-2 rounded-md border ${selectedVideo?._id === video._id
                      ? "bg-[#125ca6] border-[#125ca6] text-white"
                      : "text-black"
                      } overflow-hidden cursor-pointer`}
                    onClick={() => handleVideoSelect(video)} // Update video on click
                  >
                    {index + 1}. {video?.videoTitle}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCourse;
