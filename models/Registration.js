const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  regId: { type: String, unique: true },
  teamName: { type: String, required: true },
  college: { type: String, required: true },
  leaderName: { type: String, required: true },
  leaderEmail: { type: String, required: true },
  leaderPhone:{ type: Number, required: true},
  members: [String],
  referralCode: String,
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', registrationSchema);