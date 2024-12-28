const mongoose = require("mongoose");
const courseModel = require("../Models/courseModel.js");
const SSLCommerzPayment = require("sslcommerz-lts");

const createCourse = async (req, res) => {
  const {
    userId,
    title,
    magnetLine,
    details,
    requirements,
    instructorsId,
    banner,
    videos,
    quizzes, // Changed from 'quiz' to 'quizzes' to match frontend
    category,
    subCategory,
    syllabus,
    keywords,
    price,
    discount,
    studentsId,
    studentsOpinion,
  } = req.body;

  try {
    const newCourse = new courseModel({
      userId,
      title,
      magnetLine,
      details,
      requirements,
      instructorsId,
      banner,
      videos,
      quiz: quizzes.map((q) => ({
        // Transform incoming quizzes to match schema
        ques: q.question,
        options: q.options,
        ans: parseInt(q.answer),
      })),
      category,
      subCategory,
      syllabus,
      keywords,
      price,
      discount,
      students: studentsId ? studentsId.map((id) => ({ studentsId: id })) : [], // Initialize students array if provided
      studentsOpinion,
    });

    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await courseModel.find({});
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSingleCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  try {
    const course = await courseModel.findById(id);
    if (course) {
      res.status(200).json(course);
    } else {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllEnrolledCourse = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Find courses where the user is enrolled
    const enrolledCourses = await courseModel
      .find({
        "students.studentsId": id,
      })
      .select("title category subCategory banner students");

    if (!enrolledCourses.length) {
      return res
        .status(404)
        .json({ message: "No enrolled courses found for this user." });
    }

    res.status(200).json({
      message: "Enrolled courses retrieved successfully.",
      courses: enrolledCourses,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching courses." });
  }
};

const getReletedCourses = async (req, res) => {
  const { id } = req.params; // Expecting the course ID as a parameter
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  try {
    // Retrieve the current course using its ID
    const course = await courseModel.findById(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const keywords = course.keywords; // Get keywords from the retrieved course

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res
        .status(400)
        .json({ error: "No keywords available for this course" });
    }

    // Find courses that have at least one matching keyword
    const relatedCourses = await courseModel.find({
      _id: { $ne: id }, // Exclude the current course from the results
      keywords: { $in: keywords },
    });

    res.status(200).json(relatedCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  try {
    const updatedCourse = await courseModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (updatedCourse) {
      res.status(200).json(updatedCourse);
    } else {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "Invalid ID" });
  }

  try {
    const deletedCourse = await courseModel.findByIdAndDelete(id);
    if (deletedCourse) {
      res
        .status(200)
        .json({ message: "Course deleted successfully", deletedCourse });
    } else {
      return res.status(404).json({ error: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const giveRating = async (req, res) => {
  const { courseId } = req.params;
  const { reviewerId, rating, comments } = req.body;
  try {
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const existingReview = course.studentsOpinion.find(
      (opinion) => opinion.reviewerId.toString() === reviewerId
    );
    if (existingReview) {
      // If a review already exists, return an error message
      return res
        .status(400)
        .json({ message: "An user cannot give multiple reviews" });
    } else {
      // Add a new review if none exists
      course.studentsOpinion.push({
        reviewerId,
        rating,
        comments,
      });
    }
    await course.save();
    res.status(200).json({ message: "Rating submitted successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const courseCount = async (req, res) => {
  const courseCount = await courseModel.estimatedDocumentCount();
  res.send({ courseCount });
};
const store_id = "testi670bf7e308353";
const store_passwd = "testi670bf7e308353@ssl";
const is_live = false; //true for live, false for sandbox

const PaymentSession = mongoose.model(
  "PaymentSession",
  new mongoose.Schema(
    {
      tranId: String,
      courseId: mongoose.Schema.Types.ObjectId,
      studentsId: mongoose.Schema.Types.ObjectId,
      paymentComplete: { type: Boolean, default: false },
    },
    { timestamps: true }
  )
);

const order = async (req, res) => {
  // console.log('Course ID:', req.body.courseId);
  // console.log('Student ID:', req.body.studentsId);
  // console.log('Price:', req.body.price);

  const tran_id = new mongoose.Types.ObjectId().toString(); // Generate unique transaction ID

  // Save transaction details in a temporary collection
  const paymentSession = new PaymentSession({
    tranId: tran_id,
    courseId: req.body.courseId,
    studentsId: req.body.studentsId,
  });

  await paymentSession.save();

  const data = {
    total_amount: req.body.price,
    currency: "BDT",
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `http://localhost:4000/api/course/payment/success/${tran_id}`,
    fail_url: "http://localhost:4000/api/course/payment/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "customer@example.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
  // console.log(data);
  const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
  sslcz.init(data).then((apiResponse) => {
    // Redirect the user to payment gateway
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });
    // console.log('Redirecting to: ', GatewayPageURL)
  });
};

const success = async (req, res) => {
  console.log("Transaction ID received:", req.params.tran_id);

  try {
    // Assuming sessionData has already been retrieved from PaymentSession
    const sessionData = await PaymentSession.findOne({
      tranId: req.params.tran_id,
    });

    if (!sessionData) {
      return res
        .status(404)
        .json({ message: "No payment session found for this transaction!" });
    }

    const courseId = sessionData.courseId.toString(); // Get the course ID
    const studentsId = sessionData.studentsId.toString(); // Get the student ID

    console.log("Course ID:", courseId, "Student ID:", studentsId);

    // Update the course document in the students array
    const course = await courseModel.findOneAndUpdate(
      {
        _id: courseId,
        "students.studentsId": studentsId, // Check if the student already exists in the array
      },
      {
        $set: {
          "students.$.paymentComplete": true, // Update payment status if student exists
          "students.$.paymentId": req.params.tran_id, // Add the transaction ID
        },
      },
      { new: true }
    );

    // If the student is not already present, push a new entry into the students array
    if (!course) {
      await courseModel.findByIdAndUpdate(courseId, {
        $push: {
          students: {
            studentsId: studentsId,
            paymentId: req.params.tran_id, // Add transaction ID
            paymentComplete: true, // Mark payment as complete
          },
        },
      });
    }

    // Clean up the session data
    await PaymentSession.deleteOne({ tranId: req.params.tran_id });

    // Return success message or course object as confirmation
    res.redirect(`http://localhost:5173/singleCourse/${courseId}`);
  } catch (err) {
    console.log("Error updating course or student:", err);
    res.status(500).json({
      message: "An error occurred while updating the payment information.",
    });
  }
};

const topCourses = async (req, res) => {
  try {
    // Use MongoDB aggregation to calculate average ratings and fetch top 6 courses
    const topCourses = await courseModel.aggregate([
      // Unwind the studentsOpinion array to work on individual ratings
      { $unwind: "$studentsOpinion" },

      // Convert the rating field to a number (if stored as string)
      {
        $addFields: {
          "studentsOpinion.rating": { $toDouble: "$studentsOpinion.rating" },
        },
      },

      // Group by course and calculate the average rating
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          banner: { $first: "$banner" },
          details: { $first: "$details" },
          averageRating: { $avg: "$studentsOpinion.rating" },
        },
      },

      // Sort courses by average rating in descending order
      { $sort: { averageRating: -1 } },

      // Limit the result to top 6 courses
      { $limit: 6 },
    ]);

    res.status(200).json({
      success: true,
      data: topCourses,
    });
  } catch (error) {
    console.error("Error fetching top courses:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top courses",
    });
  }
};

const unlockVideo = async (req, res) => {
  // Log the incoming request data for debugging
  console.log("Request body:", req.body);
  console.log("Request params:", req.params);

  const courseId = req.body._id;
  const studentId = req.params.id; // Changed from req.params.studentId to req.params.id

  console.log("Parsed IDs:", { courseId, studentId });

  // Validate ObjectId format
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(studentId)
  ) {
    return res.status(400).json({
      error: "Invalid courseId or studentId",
      receivedCourseId: courseId,
      receivedStudentId: studentId,
    });
  }

  try {
    // Find the course
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find the specific student in the course's students array
    const student = course.students.find(
      (s) => s.studentsId.toString() === studentId
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found in course" });
    }

    // Check if unlockedVideo has reached the videos length
    if (student.unlockedVideo >= course.videos.length) {
      return res.status(400).json({
        error: "All videos are already unlocked for this student",
      });
    }

    // Increment unlockedVideo
    const updatedCourse = await courseModel.findOneAndUpdate(
      {
        _id: courseId,
        "students.studentsId": studentId,
      },
      {
        $inc: { "students.$.unlockedVideo": 1 },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Unlocked video incremented successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("Error in unlockVideo:", error);
    res.status(500).json({ error: error.message });
  }
};

const completeCourse = async (req, res) => {
  // Log the incoming request data for debugging
  console.log("Request body:", req.body);
  console.log("Request params:", req.params);

  const courseId = req.body._id;
  const studentId = req.params.id;

  console.log("Parsed IDs:", { courseId, studentId });

  // Validate ObjectId format
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(studentId)
  ) {
    return res.status(400).json({
      error: "Invalid courseId or studentId",
      receivedCourseId: courseId,
      receivedStudentId: studentId,
    });
  }

  try {
    // Find the course
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find the specific student in the course's students array
    const student = course.students.find(
      (s) => s.studentsId.toString() === studentId
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found in course" });
    }

    // Check if course is already completed
    if (student.isCourseComplete) {
      return res.status(400).json({
        error: "Course is already marked as complete for this student",
      });
    }

    // Set isCourseComplete to true
    const updatedCourse = await courseModel.findOneAndUpdate(
      {
        _id: courseId,
        "students.studentsId": studentId,
      },
      {
        $set: { "students.$.isCourseComplete": true },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Course marked as complete successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("Error in completeCourse:", error);
    res.status(500).json({ error: error.message });
  }
};

const completeQuiz = async (req, res) => {
  // Log the incoming request data for debugging
  console.log("Request body:", req.body);
  console.log("Request params:", req.params);

  const courseId = req.body._id;
  const studentId = req.params.id;

  console.log("Parsed IDs:", { courseId, studentId });

  // Validate ObjectId format
  if (
    !mongoose.Types.ObjectId.isValid(courseId) ||
    !mongoose.Types.ObjectId.isValid(studentId)
  ) {
    return res.status(400).json({
      error: "Invalid courseId or studentId",
      receivedCourseId: courseId,
      receivedStudentId: studentId,
    });
  }

  try {
    // Find the course
    const course = await courseModel.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Find the specific student in the course's students array
    const student = course.students.find(
      (s) => s.studentsId.toString() === studentId
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found in course" });
    }

    // Check if course is already completed
    if (student.isQuizComplete) {
      return res.status(400).json({
        error: "Quiz is already marked as complete for this student",
      });
    }

    // Set isCourseComplete to true
    const updatedCourse = await courseModel.findOneAndUpdate(
      {
        _id: courseId,
        "students.studentsId": studentId,
      },
      {
        $set: { "students.$.isQuizComplete": true },
      },
      { new: true }
    );

    res.status(200).json({
      message: "Quiz marked as complete successfully",
      updatedCourse,
    });
  } catch (error) {
    console.error("Error in complete quiz:", error);
    res.status(500).json({ error: error.message });
  }
};
const getEnrolledUsersCourses = async (req, res) => {
  try {
    // Aggregate query to count total enrolled students across all courses
    const result = await courseModel.aggregate([
      {
        $project: {
          enrolledStudentsCount: { $size: { $ifNull: ["$students", []] } }, // Count students in each course
        },
      },
      {
        $group: {
          _id: null, // Group all courses together
          totalEnrolledStudents: { $sum: "$enrolledStudentsCount" }, // Sum all student counts
        },
      },
    ]);

    // Extract the total count from the aggregation result
    const totalEnrolledStudents =
      result.length > 0 ? result[0].totalEnrolledStudents : 0;

    return res.status(200).json({
      totalEnrolledStudents,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const getTotalRevenue = async (req, res) => {
  try {
    const result = await courseModel.aggregate([
      {
        $project: {
          price: { $toDouble: "$price" }, // Convert price to a number
          discount: { $toDouble: { $ifNull: ["$discount", 0] } }, // Convert discount to a number, default to 0
          students: { $ifNull: ["$students", []] }, // Ensure students is always an array
        },
      },
      {
        $addFields: {
          effectivePrice: { $subtract: ["$price", "$discount"] }, // Subtract discount from price
        },
      },
      {
        $addFields: {
          paidStudents: {
            $filter: {
              input: "$students",
              as: "student",
              cond: { $eq: ["$$student.paymentComplete", true] }, // Filter for students with paymentComplete = true
            },
          },
        },
      },
      {
        $addFields: {
          revenue: {
            $multiply: [
              { $size: "$paidStudents" }, // Count of paid students
              { $max: ["$effectivePrice", 0] }, // Ensure no negative prices due to discount
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$revenue" }, // Sum up revenue from all courses
        },
      },
    ]);

    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

    res.status(200).json({
      message: "Total revenue calculated successfully",
      totalRevenue,
    });
  } catch (error) {
    console.error("Error calculating total revenue:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getCourseCategories = async (req, res) => {
  try {
    // Fetching unique course categories with their count
    const categories = await courseModel.aggregate([
      {
        $group: {
          _id: "$category", // Group by category
          count: { $sum: 1 }, // Count the number of courses in each category
        },
      },
      {
        $project: {
          _id: 0, // Don't include the _id field
          name: "$_id", // Rename _id to name
          count: 1, // Include the count field
        },
      },
    ]);

    console.log("Categories fetched:", categories);

    // If no categories found, send empty array
    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: "No categories found" });
    }

    // Return the list of categories with their counts
    res.status(200).json({
      categories: categories, // Categories with counts only
    });
  } catch (error) {
    console.error("Error fetching course categories:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
const getTotalAverageRating = async (req, res) => {
  try {
    // Aggregation pipeline to calculate the total average rating across all courses
    const totalAverageRating = await courseModel.aggregate([
      {
        $unwind: "$studentsOpinion", // Unwind the studentsOpinion array to access individual ratings
      },
      {
        $group: {
          _id: null, // Grouping all reviews into one group
          totalRating: { $sum: { $toDouble: "$studentsOpinion.rating" } }, // Sum all the ratings (convert from string to number)
          totalReviews: { $sum: 1 }, // Count the total number of reviews
        },
      },
      {
        $project: {
          _id: 0, // Don't include the _id field
          avgRating: {
            $round: [{ $divide: ["$totalRating", "$totalReviews"] }, 1],
          }, // Calculate the average rating
        },
      },
    ]);

    // If no ratings found, return a message indicating no reviews
    if (!totalAverageRating || totalAverageRating.length === 0) {
      return res.status(404).json({ message: "No reviews or ratings found" });
    }

    // Return the total average rating
    res.status(200).json({
      avgRating: totalAverageRating[0].avgRating, // Return the calculated average rating
    });
  } catch (error) {
    console.error("Error calculating total average rating:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getCompletedCoursesCount = async (req, res) => {
  try {
    // Aggregation pipeline to count the number of completed courses across all users
    const completedCoursesCount = await courseModel.aggregate([
      {
        $unwind: "$students",
      },
      {
        $match: {
          "students.isCourseComplete": true,
        },
      },
      {
        $group: {
          _id: "$_id", // Group by course ID
          completedStudentsCount: { $sum: 1 }, // Count the number of students who completed the course
        },
      },
      {
        $count: "totalCompletedCourses", // Count the total number of courses that have been completed
      },
    ]);

    // If no completed courses found, return a message indicating no completed courses
    if (!completedCoursesCount || completedCoursesCount.length === 0) {
      return res.status(404).json({ message: "No completed courses found" });
    }

    // Return the completed courses count
    res.status(200).json({
      totalCompletedCourses: completedCoursesCount[0].totalCompletedCourses, // Return the count of completed courses
    });
  } catch (error) {
    console.error("Error fetching completed courses count:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAverageCompletionTime = async (req, res) => {
  try {
    // Find all courses with students who completed the course
    const courses = await courseModel.find(
      {
        "students.isCourseComplete": true,
      },
      {
        "students.$": 1, // Only fetch students array
      }
    );

    let totalCompletionTime = 0; // Total time taken by all students
    let completedCoursesCount = 0; // Number of students who completed courses

    courses.forEach((course) => {
      course.students.forEach((student) => {
        if (
          student.isCourseComplete &&
          student.startTime &&
          student.completionTime
        ) {
          const timeTaken =
            new Date(student.completionTime) - new Date(student.startTime);
          totalCompletionTime += timeTaken;
          completedCoursesCount++;
        }
      });
    });

    // Calculate the average completion time in milliseconds
    const averageCompletionTime =
      completedCoursesCount > 0
        ? totalCompletionTime / completedCoursesCount
        : 0;

    // Convert milliseconds to days
    const averageTimeInDays = Math.floor(
      averageCompletionTime / (1000 * 60 * 60 * 24)
    );

    res.status(200).json({
      message: "Average completion time retrieved successfully",
      averageCompletionTimeInDays: averageTimeInDays,
    });
  } catch (error) {
    console.error("Error calculating average completion time:", error);
    res
      .status(500)
      .json({ message: "Error calculating average completion time" });
  }
};

module.exports = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  getAllEnrolledCourse,
  getReletedCourses,
  updateCourse,
  deleteCourse,
  giveRating,
  courseCount,
  order,
  success,
  topCourses,
  unlockVideo,
  completeCourse,
  completeQuiz,
  getEnrolledUsersCourses,
  getTotalRevenue,
  getCourseCategories,
  getTotalAverageRating,
  getCompletedCoursesCount,
  getAverageCompletionTime,
};
