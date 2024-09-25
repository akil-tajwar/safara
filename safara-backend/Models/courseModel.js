const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userCollection",
    },
    title: {
        type: String,
    },
    magnetLine: {
        type: String,
    },
    details: {
        type: String
    },
    requirements: {
        type: String
    },
    instructorsId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "userCollection",
    }],
    banner: {
        type: String,
    },
    videos: [{
        videoTitle: {
            type: String,
        },
        videoLink: {
            type: String,
        }
    }],
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
    studentsOpinion: [{
        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userCollection",
        },
        rating: {
            type: String,
        },
        comments: {
            type: String,
        }
    }],
}, { timestamps: true });

const course = mongoose.model("courseCollection", courseSchema);

module.exports = course;
