const mongoose = require("mongoose");
const courseModel = require("../Models/courseModel.js");
const SSLCommerzPayment = require('sslcommerz-lts')

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

const courseCount = async (req, res) => {

    const courseCount = await courseModel.estimatedDocumentCount();
    res.send({ courseCount })

}

const store_id = 'testi670bf7e308353'
const store_passwd = 'testi670bf7e308353@ssl'
const is_live = false //true for live, false for sandbox

const PaymentSession = mongoose.model('PaymentSession', new mongoose.Schema({
    tranId: String,
    courseId: mongoose.Schema.Types.ObjectId,
    studentsId: mongoose.Schema.Types.ObjectId,
    paymentComplete: { type: Boolean, default: false }
}, { timestamps: true }));

const order = async (req, res) => {
    // console.log('Course ID:', req.body.courseId);
    // console.log('Student ID:', req.body.studentsId);
    // console.log('Price:', req.body.price);

    const tran_id = new mongoose.Types.ObjectId().toString(); // Generate unique transaction ID

    // Save transaction details in a temporary collection
    const paymentSession = new PaymentSession({
        tranId: tran_id,
        courseId: req.body.courseId,
        studentsId: req.body.studentsId
    });

    await paymentSession.save();

    const data = {
        total_amount: 1,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `http://localhost:4000/api/course/payment/success/${tran_id}`,
        fail_url: 'http://localhost:4000/api/course/payment/fail',
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
    // console.log(data);
    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live)
    sslcz.init(data).then(apiResponse => {
        // Redirect the user to payment gateway
        let GatewayPageURL = apiResponse.GatewayPageURL
        res.send({ url: GatewayPageURL })
        // console.log('Redirecting to: ', GatewayPageURL)
    });
}

const success = async (req, res) => {
    console.log('Transaction ID received:', req.params.tran_id);

    try {
        // Assuming sessionData has already been retrieved from PaymentSession
        const sessionData = await PaymentSession.findOne({ tranId: req.params.tran_id });

        if (!sessionData) {
            return res.status(404).json({ message: 'No payment session found for this transaction!' });
        }

        const courseId = sessionData.courseId.toString();  // Get the course ID
        const studentsId = sessionData.studentsId.toString(); // Get the student ID

        console.log('Course ID:', courseId, 'Student ID:', studentsId);

        // Update the course document in the students array
        const course = await courseModel.findOneAndUpdate(
            {
                _id: courseId,
                "students.studentsId": studentsId // Check if the student already exists in the array
            },
            {
                $set: {
                    "students.$.paymentComplete": true,  // Update payment status if student exists
                    "students.$.paymentId": req.params.tran_id  // Add the transaction ID
                }
            },
            { new: true }
        );

        // If the student is not already present, push a new entry into the students array
        if (!course) {
            await courseModel.findByIdAndUpdate(courseId, {
                $push: {
                    students: {
                        studentsId: studentsId,
                        paymentId: req.params.tran_id,  // Add transaction ID
                        paymentComplete: true  // Mark payment as complete
                    }
                }
            });
        }

        // Clean up the session data
        await PaymentSession.deleteOne({ tranId: req.params.tran_id });

        // Return success message or course object as confirmation
        res.redirect(`http://localhost:5173`)
    } catch (err) {
        console.log('Error updating course or student:', err);
        res.status(500).json({ message: 'An error occurred while updating the payment information.' });
    }
}

module.exports = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    getReletedCourses,
    updateCourse,
    deleteCourse,
    giveRating,
    courseCount,
    order,
    success,
};
