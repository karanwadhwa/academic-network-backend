const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentProfileSchema = new Schema({
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

  smartCardID: {
    type: String,
    required: true,
    unique: true
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

  // mentor details
  mentor: {
    name: {
      type: String,
      required: true
    },
    userID: {
      type: String,
      required: true
    }
  },

  courseDetails: {
    department: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    class: {
      type: String,
      required: true
    },
    rollNo: {
      type: Number,
      required: true
    },
    batch: {
      type: String,
      required: true
    },
    elective: {
      type: String,
      default: null
    },
    cr: {
      type: Boolean,
      default: false
    }
  },
  /* 
  subscriptions: {
    type: Array,
    required: true,
    default: ["public", "students"]
  },
 */
  studentCouncils: {
    IEEE: {
      type: String,
      default: null
    },
    CSI: {
      type: String,
      default: null
    },
    IETE: {
      type: String,
      default: null
    },
    ACM: {
      type: String,
      default: null
    },
    ISTE: {
      type: String,
      default: null
    },
    ECELL: {
      type: String,
      default: null
    }
  }

  /* blocked: {
    type: Boolean,
    default: false
  } */
});

module.exports = StudentProfile = mongoose.model(
  "student-profiles",
  StudentProfileSchema
);
