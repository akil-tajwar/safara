const mongoose = require("mongoose");
const courseModel = require("../Models/courseModel.js");

const createCourse = async (req, res) => {
    const { userId, title, details, requirements, instructorsId, banner, videos, category, subCategory, syllabus, keywords, price, discount, studentsId } = req.body;

    try {
        const newCourse = new courseModel({
            userId,
            title,
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
            studentsId
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

module.exports = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateCourse,
    deleteCourse,
};
