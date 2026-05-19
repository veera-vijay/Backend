const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    minlength: [3, "username must be atleast 3 characters long"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    unique: true,
    minlength: [6, "password must be at least 6 characters "],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  otpCode: {
    type: String,
    default: null,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
  forgotPasswordOtp: { type: String, default: null },
  forgotPasswordExpiry: { type: Date, default: null },
});

module.exports = mongoose.model("User", userSchema);
