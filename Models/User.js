const mongoose = require("mongoose");
const Schema = mongoose.Schema();

// Create Schema
const UserSchema = new Schema({
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  reg: {
    type: Number,
    required: true,
    min: 5,
    max: 5
  },
  smartCardId: {
    type: String,
    required: true,
    min: 11,
    max: 11
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
