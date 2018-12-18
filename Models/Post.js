const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const { DEFAULT_AVATAR } = process.env;

const PostSchema = new Schema({
  // _id key from users collection
  userKey: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },

  title: {
    type: String
  },

  body: {
    type: String,
    required: true
  },

  author: {
    type: String,
    required: true
  },

  avatar: {
    type: String,
    required: true,
    default: DEFAULT_AVATAR
  },

  date: {
    type: Date,
    required: true,
    default: Date.now
  },

  likes: [
    {
      // _id key from users collection
      userKey: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
      }
    }
  ],

  comments: [
    {
      // _id key from users collection
      userKey: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
      },

      body: {
        type: String,
        required: true
      },

      author: {
        type: String,
        required: true
      },

      avatar: {
        type: String,
        required: true,
        default: DEFAULT_AVATAR
      },

      date: {
        type: Date,
        required: true,
        default: Date.now
      }
    }
  ]
});

module.exports = Post = mongoose.model("posts", PostSchema);
