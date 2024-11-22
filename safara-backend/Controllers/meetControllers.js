const { google } = require("googleapis"); 
require("dotenv").config();
// Missing Google API Import
const { OAuth2}  = google.auth;
// Google OAuth2 Client
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
// console.log(CLIENT_ID,CLIENT_SECRET,REFRESH_TOKEN);

// Route to create a Google Meet event
const createMeet=async(req,res)=>{
  const { summary, startTime, endTime } = req.body;
  console.log("from backend ai create-meet", summary, startTime, endTime);
  const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
  
  // Google Calendar Setup
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });
  
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
}

module.exports={ createMeet }