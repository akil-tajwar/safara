const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

const userRoutes = require("./Routes/userRoutes.js");
const meetRoutes = require("./Routes/meetRoutes.js");
const courseRoutes = require("./Routes/courseRoutes.js");
const whatsappRoutes = require("./Routes/whatsappRoutes.js");

const app = express();
const baseUrl = process.env.BASE_URL;
// ✅ 1. CORS must be FIRST
app.use(
  cors({
    origin: [
      "http://localhost:5173", // your local dev frontend
      "https://safaraapp.netlify.app",
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);

// ✅ 2. Basic express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ 3. Then security and performance
app.use(helmet());
app.use(compression());

// ✅ 4. Routes
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/whatsapp", whatsappRoutes);
app.use("/api/meet", meetRoutes);

// ✅ 5. Root route
app.get("/", (req, res) => {
  res.send("Server is working!");
});

// ✅ 6. Static files (optional)
app.use(express.static("dist"));

// ✅ 7. CSP (optional, but keep after CORS)
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
  );
  next();
});

// ✅ 8. Connect to DB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully Connected to DB");
    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`🚀 Server running on PORT ${PORT}`));
  })
  .catch((error) => console.log("❌ DB Connection Error: " + error.message));
