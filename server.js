require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const Registration = require('./models/Registration');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Email Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Helper: Generate Unique Reg ID (e.g., SIS-1234)
const generateRegId = () => `SIS-${Math.floor(1000 + Math.random() * 9000)}`;

// API Route
app.post('/api/register', async (req, res) => {
  try {
    const { teamName, college, leaderName, leaderEmail, referralCode } = req.body;
    
    // Collect all dynamic members from the body
    const members = [];
    for (let i = 2; i <= 4; i++) {
      if (req.body[`member${i}`]) members.push(req.body[`member${i}`]);
    }

    const regId = generateRegId();

    const newRegistration = new Registration({
      regId,
      teamName,
      college,
      leaderName,
      leaderEmail,
      members,
      referralCode
    });

    await newRegistration.save();

    // Send Confirmation Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: leaderEmail,
      subject: 'Registration Successful - Sustainable Industry Sprint',
      text: `Hello ${leaderName},\n\nYour team "${teamName}" has been successfully registered for the Sustainable Industry Sprint!\n\nYour Registration ID: ${regId}\nDate: March 11th\nVenue: SoEEE Seminar Hall\n\nSee you there!`
    };

    transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Registration Successful', regId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));