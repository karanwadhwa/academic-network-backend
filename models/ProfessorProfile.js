const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfessorProfileSchema = new Schema({
  // _id key from users collection
  userKey: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
    unique: true
  },

  // userID - Registration No / StaffID
  userID: {
    type: String,
    required: true,
    unique: true
  },

  department: {
    type: String,
    required: true
  },

  designation: {
    type: String,
    required: true
  },

  // mod access
  moderator: {
    type: Boolean,
    default: false
  },

  bio: String,

  phone: Number,

  badges: {
    type: [String],
    default: []
  },

  // mentee details
  mentees: {
    type: Array,
    userKey: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true
    },
    userID: {
      type: String,
      required: true,
      unique: true
    },
    fname: {
      type: String,
      required: true
    },
    lname: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    smartCardID: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: Number
    },
    courseDetails: {
      type: Object,
      required: true
    },
    /* mentor: {
      type: Object,
      required: true
    }, */
    default: []
  },
  /* 
  subscriptions: {
    type: Array,
    required: true,
    default: ["public", "professors"]
  },
 */
  education: {
    type: Array,
    school: {
      type: String,
      required: true
    },
    degree: {
      type: String,
      required: true
    },
    field: {
      type: String,
      required: true
    },
    from: {
      type: Number,
      required: true,
      min: 1950,
      max: 2050
    },
    to: {
      type: Number,
      min: 1950,
      max: 2050
    },
    current: {
      type: Boolean,
      required: true,
      default: false
    },
    default: []
  }

  /* blocked: {
    type: Boolean,
    default: false
  } */
});

module.exports = ProfessorProfile = mongoose.model(
  "professor-profiles",
  ProfessorProfileSchema
);
