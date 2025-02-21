const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");

const userRoutes = require("./Routes/userRoutes.js");
const meetRoutes = require("./Routes/meetRoutes.js");
const courseRoutes = require("./Routes/courseRoutes.js");

const whatsappRoutes = require("./Routes/whatsappRoutes.js");
require("dotenv").config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true, // If needed for cookies/auth
  })
);

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/meet", meetRoutes);

// Test route
app.get("/", async (req, res) => {
  res.send("Server is working!");
});
// Set CSP headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  next();
});
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t9lecvs.mongodb.net/Safara-API?retryWrites=true&w=majority&appName=Cluster0`;
mongoose
  .connect(url)
  .then(() => {
    // Listen for requests
    console.log("Successfully Connected to DB");
    app.listen(process.env.PORT || 4000, () => {
      // Added default port 4000
      console.log(`Listening on PORT ${process.env.PORT || 4000}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to DB: " + error.message);
  });
