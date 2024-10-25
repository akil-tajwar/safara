const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const SSLCommerzPayment = require('sslcommerz-lts')
const userRoutes = require("./Routes/userRoutes.js");
const courseRoutes = require("./Routes/courseRoutes.js");
const paymentRoutes = require("./Routes/paymentRoutes.js");
const courseModel = require("./Models/courseModel.js");
const userModel = require("./Models/userModel.js");

require("dotenv").config();
const app = express();

const store_id = 'testi670bf7e308353'
const store_passwd = 'testi670bf7e308353@ssl'
const is_live = false //true for live, false for sandbox

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true // If needed for cookies/auth
}));

// Middleware to parse JSON request bodies
app.use(express.json());

app.use(express.urlencoded({ extended: true }));



//routes
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/payment", paymentRoutes);



app.get("/", async (req, res) => {
  res.send("working server safara");
});
const PaymentSession = mongoose.model('PaymentSession', new mongoose.Schema({
  tranId: String,
  courseId: mongoose.Schema.Types.ObjectId,
  studentsId: mongoose.Schema.Types.ObjectId,
  paymentComplete: { type: Boolean, default: false }
}, { timestamps: true }));

// const tran_id = new mongoose.Types.ObjectId().toString();

app.post('/order', async (req, res) => {
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
    success_url: `http://localhost:4000/payment/success/${tran_id}`,
    fail_url: 'http://localhost:4000/payment/fail',
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
})

app.post('/payment/success/:tran_id', async (req, res) => {
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
});

app.post('/payment/fail/:tran_id', async(req, res) => {
  
})


const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t9lecvs.mongodb.net/Safara-API?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(url)
  .then(() => {
    // listen for request
    console.log("Successfully Connected to DB");
    app.listen(process.env.PORT, () => {
      console.log(`Listening on PORT ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
