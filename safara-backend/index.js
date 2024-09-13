const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes.js");
const courseRoutes = require("./Routes/courseRoutes.js");
require("dotenv").config();
const app = express();

app.use(cors( {
  origin:['http://localhost:5173',"http://localhost:5174"]
}));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));



//routes
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);



app.get("/", async (req, res) => {
  res.send("working server safara");
});

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
