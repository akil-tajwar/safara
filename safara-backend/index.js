const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const helmet = require("helmet");
const compression = require("compression");

// Use helmet middleware for secure headers

const userRoutes = require("./Routes/userRoutes.js");
const meetRoutes = require("./Routes/meetRoutes.js");
const courseRoutes = require("./Routes/courseRoutes.js");

const whatsappRoutes = require("./Routes/whatsappRoutes.js");
require("dotenv").config();
const app = express();
const baseUrl = process.env.BASE_URL;
console.log("🚀 ~ baseUrl:", baseUrl);
app.use(
  cors({
    origin: baseUrl, // Your frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true, // If needed for cookies/auth
  })
);
// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());

// Routes
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/meet", meetRoutes);

// Test route
app.get("/", async (req, res) => {
  res.send("Server is working!");
});
app.use(express.static("dist"));

// Set CSP headers
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  next();
});
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
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
