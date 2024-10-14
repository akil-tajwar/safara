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
    bkashPayment
} = require("../Controllers/courseController.js");

const router = express.Router();


//post
router.post('/createCourse', createCourse);
router.post('/giveRating/:courseId', giveRating);

//get
router.get('/getAllCourses', getAllCourses);
router.get('/getCourseCount', courseCount );
router.get('/getSingleCourse/:id', getSingleCourse);
router.get('/getReletedCourse', getReletedCourses);

//delete
router.delete('/deleteCourse/:id', deleteCourse);

//patch
router.patch('/updateCourse/:id', updateCourse);


module.exports = router;