const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { DEFAULT_AVATAR } = process.env;

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
  userID: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true,
    default: DEFAULT_AVATAR
  },
  audience: {
    type: Array,
    required: true,
    default: []
  },
  subscriptions: {
    type: Array,
    required: true,
    default: []
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = User = mongoose.model("users", UserSchema);
