const express = require("express");
const {
    createCourse,
    getAllCourses,
    getSingleCourse,
    deleteCourse,
    updateCourse
} = require("../Controllers/courseController.js");

const router = express.Router();


//post
router.post('/createCourse', createCourse);

//get
router.get('/getAllCourses', getAllCourses);
router.get('/getSingleCourse/:id', getSingleCourse);

//delete
router.delete('/deleteCourse/:id', deleteCourse);

//patch
router.patch('/updateCourse/:id', updateCourse);


module.exports = router;