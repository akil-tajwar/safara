const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userCollection",
    },
    title: {
        type: String,
    },
    details:{
        type: String
    },
    requirements:{
        type: String
    },
    instructorsId: [{
        type: mongoose.Schema.Types.ObjectId, // Ensure this is the correct type
        ref: "userCollection", // Reference the correct collection
      }],
    banner: {
        type: String,
    },
    videos: [String],
    category: {
        type: String,
    },
    subCategory: {
        type: String,
    },
    syllabus: {
        type: String,
    },
    keywords: [String],
    price: {
        type: String,
    },
    discount: {
        type: String,
    },
    studentsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userCollection",
      }],
}, { timestamps: true });

const course = mongoose.model("courseCollection", courseSchema);

module.exports = course;
