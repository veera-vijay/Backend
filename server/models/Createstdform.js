const mongoose = require("mongoose");
const stdSchema = new mongoose.Schema({
  name: String,
  email: String,
  course: String,
  gender: String,
  age: Number
});

module.exports = mongoose.model("Std", stdSchema);
