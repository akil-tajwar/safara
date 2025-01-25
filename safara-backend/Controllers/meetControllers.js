const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require("dotenv").config();
// Missing Google API Import
const { OAuth2 } = google.auth;
// Google OAuth2 Client
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
// console.log(CLIENT_ID,CLIENT_SECRET,REFRESH_TOKEN);

// Route to create a Google Meet event
const createMeet = async (req, res) => {
  console.log("hitting create meet");
  const { summary, startTime, endTime } = req.body;

  console.log("from backend ai create-meet", summary, startTime, endTime);
  const oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET);
  oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  // Google Calendar Setup
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  if (!summary || !startTime || !endTime) {
    return res
      .status(400)
      .send("Missing required fields: summary, startTime, and endTime");
  }

  // Event object for Google Calendar
  const event = {
    summary: summary || "Google Meet Event",
    start: {
      dateTime: new Date(startTime).toISOString(),
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: new Date(endTime).toISOString(),
      timeZone: "America/Los_Angeles",
    },
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
};
const sendSchedule = async (req, res) => {
    console.log("HITTING SCHEDULE");
    const { usersData, meetLink, courseTitle } = req.body;
  
    // Validate request body
    if (!Array.isArray(usersData) || usersData.length === 0 || !meetLink) {
      return res.status(400).send("Invalid or missing usersData or meetLink");
    }
  
    console.log(usersData, meetLink,courseTitle);
  
    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: "gmail", // or another email service
      auth: {
        user: "ammaraslam7164@gmail.com",
        pass: "zedyjqbuoqhojlgr", // App-specific password for Gmail
      },
    });
  
    // Map over usersData and send email to each user
    const emailPromises = usersData.map((user) => {
      if (!user.email) {
        console.warn(`Skipping user without an email: ${JSON.stringify(user)}`);
        return Promise.resolve(); // Skip users without an email
      }
  
      const mailOptions = {
        from: "ammaraslam7164@gmail.com", // Sender's email
        to: user.email, // Receiver's email
        subject: "Your Scheduled Google Meet Link",
        html: `
        <h2>Hello ${user.email || "Valued Student"},</h2>
        <p>We are excited to inform you about the upcoming class for your course <strong>${courseTitle}</strong>.</p>
        <p><strong>Meeting Details:</strong></p>
        <ul>
          
          <li><strong>Meeting Link:</strong> <a href="${meetLink}" target="_blank">${meetLink}</a></li>
        </ul>
        <p>Please make sure to join the meeting on time. Feel free to reach out if you have any questions.</p>
        <p>Looking forward to your participation!</p>
        <p>Best regards,<br/><strong>Safara Academy Team</strong></p>
      `,
      };
  
      // Send email and handle errors for individual users
      return transporter.sendMail(mailOptions).catch((error) => {
        console.error(`Error sending email to ${user.email}:`, error.message);
      });
    });
  
    // Wait for all emails to be sent
    try {
      await Promise.all(emailPromises);
      res.status(200).send("Emails sent successfully to all users");
    } catch (error) {
      console.error("Error sending emails:", error.message);
      res.status(500).send("Error sending some or all emails");
    }
  };

module.exports = { createMeet, sendSchedule };
