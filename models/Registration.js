const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  regId: {
    type: String,
    required: true,
    unique: true
  },
  teamName: {
    type: String,
    required: true,
    unique: true,   // ✅ Prevent duplicate team names
    trim: true
  },
  college: {
    type: String,
    required: true
  },
  leaderName: {
    type: String,
    required: true
  },
  leaderEmail: {
    type: String,
    required: true,
    unique: true,   // ✅ Prevent duplicate emails
    lowercase: true
  },
  leaderPhone: {
    type: String,
    required: true
  },
  members: [String],
  referralCode: String
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);