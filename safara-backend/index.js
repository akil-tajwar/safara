const cors = require("cors");
const mongoose = require("mongoose");
const express = require("express");
const axios = require('axios');
const { google } = require("googleapis"); // Missing Google API Import
const userRoutes = require("./Routes/userRoutes.js");
const courseRoutes = require("./Routes/courseRoutes.js");
const whatsappRoutes = require("./Routes/whatsappRoutes.js");

require("dotenv").config();
const app = express();
const { OAuth2 } = google.auth;

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true // If needed for cookies/auth
}));

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/whatsapp", whatsappRoutes);

// Google OAuth2 Client
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Google Calendar Setup
const calendar = google.calendar({ version: "v3", auth: oauth2Client });

// Route to create a Google Meet event
app.post("/api/create-meet", async (req, res) => {
  const { summary, startTime, endTime } = req.body;
  console.log("from backend ai create-meet", summary, startTime, endTime);

  if (!summary || !startTime || !endTime) {
    return res.status(400).send("Missing required fields: summary, startTime, and endTime");
  }

  // Event object for Google Calendar
  const event = {
    summary: summary || "Google Meet Event",
    start: { dateTime: new Date(startTime).toISOString(), timeZone: "America/Los_Angeles" },
    end: { dateTime: new Date(endTime).toISOString(), timeZone: "America/Los_Angeles" },
    conferenceData: {
      createRequest: {
        requestId: "sample123", // A unique request ID
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
      conferenceDataVersion: 1,
    });

    res.json({ meetLink: response.data.hangoutLink });
  } catch (error) {
    // Log the error for debugging
    console.error("Error creating event:", error);
    // Send a detailed error message back to the client
    res.status(500).send("Error creating event: " + error.message);
  }
});


// Test route
app.get("/", async (req, res) => {
  res.send("Server is working!");
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
