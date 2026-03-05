const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Registration = require('./models/Registration');
const { sendConfirmationEmail } = require('./mailService');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// ===============================
// MongoDB Connection
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });

// Email configuration moved to mailService.js

// ===============================
// Helper: Generate Unique Reg ID
// ===============================
const generateRegId = () =>
  `SIS-${Math.floor(1000 + Math.random() * 9000)}`;

// ===============================
// Health Check Route
// ===============================
app.get('/', (req, res) => {
  res.send("🚀 IUCEE Backend is Running");
});

// ===============================
// Registration Route
// ===============================
app.post('/api/register', async (req, res) => {
  try {
    let {
      teamName,
      college,
      leaderName,
      leaderEmail,
      leaderPhone,
      referralCode
    } = req.body;

    // Sanitize
    if (leaderEmail) leaderEmail = leaderEmail.trim().toLowerCase();

    // Basic Validation
    if (!teamName || !college || !leaderName || !leaderEmail || !leaderPhone) {
      return res.status(400).json({
        message: "All required fields must be filled."
      });
    }

    // Collect Members
    const members = [];
    for (let i = 2; i <= 4; i++) {
      if (req.body[`member${i}`]) {
        members.push(req.body[`member${i}`]);
      }
    }

    const existingTeam = await Registration.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({
        message: "Team name already registered."
      });
    }

    const existingEmail = await Registration.findOne({ leaderEmail });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered."
      });
    }

    const regId = generateRegId();

    const newRegistration = new Registration({
      regId,
      teamName,
      college,
      leaderName,
      leaderEmail,
      leaderPhone,
      members,
      referralCode
    });

    await newRegistration.save();
    console.log("✅ Registration saved to MongoDB");

    // Send Email (Do NOT crash if email fails)
    try {
      await sendConfirmationEmail({
        leaderEmail,
        leaderName,
        teamName,
        regId
      });
    } catch (mailError) {
      console.error("❌ Email sending failed:", mailError.message);
      // Do NOT stop registration if email fails
    }

    res.status(201).json({
      message: "Registration Successful",
      regId
    });

  } catch (error) {
    console.error("🔥 REGISTER ROUTE ERROR:", error);
    res.status(500).json({
      message: error.message
    });
  }
});

// ===============================
// Start Server
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
