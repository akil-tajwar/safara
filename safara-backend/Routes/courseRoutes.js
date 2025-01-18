const express = require("express");
const {
  createCourse,
  getAllCourses,
  getSingleCourse,
  deleteCourse,
  updateCourse,
  getReletedCourses,
  giveRating,
  courseCount,
  order,
  success,
  topCourses,
  unlockVideo,
  completeCourse,
  getAllEnrolledCourse,
  completeQuiz,
  getEnrolledUsersCourses,
  getTotalRevenue,
  getCourseCategories,
  getTotalAverageRating,
  getCompletedCoursesCount,
  getAverageCompletionTime,
  getAllTransactions,
  fail,
  getTotalPayment,
  getTotalPaymentBySpecificStudent,

  getVideosCount,
  getUserCourseProgress,
} = require("../Controllers/courseController.js");

const router = express.Router();

//post
router.post("/createCourse", createCourse);
router.post("/giveRating/:courseId", giveRating);
router.post("/payment/order", order);
router.post("/payment/success/:tran_id/:encodedData", success);
router.post("/payment/fail/:courseId", fail);

//get
router.get("/getAllCourses", getAllCourses);
router.get("/getCourseCount", courseCount);
router.get("/getSingleCourse/:id", getSingleCourse);
router.get("/getAllEnrolledCourse/:id", getAllEnrolledCourse);
router.get("/getReletedCourse", getReletedCourses);
router.get("/topCourses", topCourses);
router.get("/enrolledUsersCourses", getEnrolledUsersCourses);
router.get("/getTotalRevenue", getTotalRevenue);
router.get("/getCourseCategories", getCourseCategories);
router.get("/getAvgRating", getTotalAverageRating);
router.get("/getCompletedCoursesCount", getCompletedCoursesCount);
router.get("/getAverageCompletionTime", getAverageCompletionTime);
router.get("/getAllTransactions", getAllTransactions);
router.get("/getTotalPayment", getTotalPayment);
router.get("/getVideosCount", getVideosCount);
router.get("/getUserCourseProgress/:id", getUserCourseProgress);
router.get("/getSpentByStudent/:studentId", getTotalPaymentBySpecificStudent);

//delete
router.delete("/deleteCourse/:id", deleteCourse);

//patch
router.patch("/updateCourse/:id", updateCourse);
router.patch("/unlockVideo/:id", unlockVideo);
router.patch("/completeCourse/:id", completeCourse); //id == user's id, not course id
router.patch("/completeQuiz/:id", completeQuiz); //id == user's id, not course id

module.exports = router;
