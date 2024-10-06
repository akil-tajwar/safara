const mongoose = require("mongoose");
const courseModel = require("../Models/courseModel.js");

const createCourse = async (req, res) => {
    const { userId, title, magnetLine, details, requirements, instructorsId, banner, videos, category, subCategory, syllabus, keywords, price, discount, studentsId, studentsOpinion } = req.body;

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
            category,
            subCategory,
            syllabus,
            keywords,
            price,
            discount,
            studentsId,
            studentsOpinion
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

const getReletedCourses = async (req, res) => {
    const { id } = req.params;  // Expecting the course ID as a parameter
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Invalid ID" });
    }

    try {
        // Retrieve the current course using its ID
        const course = await courseModel.findById(id);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        const keywords = course.keywords;  // Get keywords from the retrieved course

        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return res.status(400).json({ error: "No keywords available for this course" });
        }

        // Find courses that have at least one matching keyword
        const relatedCourses = await courseModel.find({
            _id: { $ne: id },  // Exclude the current course from the results
            keywords: { $in: keywords }
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
        const updatedCourse = await courseModel.findByIdAndUpdate(id, req.body, { new: true });
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
            res.status(200).json({ message: "Course deleted successfully", deletedCourse });
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
            return res.status(400).json({ message: "An user cannot give multiple reviews" });
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

const courseCount = async(req,res)=>{

    const courseCount= await courseModel.estimatedDocumentCount();
    res.send({courseCount})
     
}


module.exports = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    getReletedCourses,
    updateCourse,
    deleteCourse,
    giveRating,
    courseCount
};
