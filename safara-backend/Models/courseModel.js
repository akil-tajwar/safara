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
    students: [{
        studentsId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userCollection",
        },
        paymentId: {
            type: String,
        },
        paymentComplete: {
            type: Boolean,
            default: false
        },
        isCourseComplete: {
            type: Boolean,
            default: false
        },
        certificateUrl: {
            type: String,
        }
    }],
    studentsOpinion: [{
        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "userCollection",
        },
        rating: {
            type: String, //for rating field
        },
        comments: {
            type: String,
        }
    }],
}, { timestamps: true });

const course = mongoose.model("courseCollection", courseSchema);

module.exports = course;
