const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const SSLCommerzPayment = require('sslcommerz-lts')
const userRoutes = require("./Routes/userRoutes.js");
const courseRoutes = require("./Routes/courseRoutes.js");
const paymentRoutes = require("./Routes/paymentRoutes.js");
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

const tran_id = new mongoose.Types.ObjectId().toString();

app.post('/order', async (req, res) => {
  // console.log(req.body);

  const data = {
    total_amount: 1,
    currency: 'BDT',
    tran_id: tran_id, // use unique tran_id for each api call
    success_url: `http://localhost:4000/payment/success/${tran_id}`,
    fail_url: 'http://localhost:3030/fail',
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
    res.send({url:GatewayPageURL})
    // console.log('Redirecting to: ', GatewayPageURL)
  });
})

app.post('/payment/success/:tran_id',async(req,res) => {
  console.log(req.params.tran_id);
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
