const express = require("express");
const passport = require("passport");

// Import Models
const User = require("../../models/User");
const StudentProfile = require("../../models/StudentProfile");
const ProfessorProfile = require("../../models/ProfessorProfile");

const router = express.Router();

// @route   GET /api/profile/test
// @desc    profile test route, nothing functional.
// @access  Public
router.get("/test", (req, res) => {
  res.json({ msg: "/api/profile/test route" });
});

// @route   GET /api/profile
// @desc    fetches currently logged in users profile
// @access  Protected
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    StudentProfile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = "Profile not found.";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST /api/profile/create/student
// @desc    creates student profile
// @access  Protected
router.post(
  "/create/student",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //check usertype
    if (req.user.userType !== "student") {
      return res.status(404).json({
        error:
          "invalid user type. User needs to be a student to access this route"
      });
    }

    const profileFields = {};
    profileFields.subscriptions = ["public", "students"];

    // Set the userKey and userID from User model stored in req.user
    profileFields.userKey = req.user.id;
    profileFields.userID = req.user.userID;

    profileFields.smartCardID = req.body.smartCardID;

    // optional fields
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.phone) profileFields.phone = req.body.phone;

    // mentor details
    profileFields.mentor = {};
    profileFields.mentor.name = req.body.mentorName;
    profileFields.mentor.userID = req.body.mentorID;

    // courseDetails
    const courseDetailsFields = [
      "department",
      "year",
      "class",
      "rollNo",
      "batch"
    ];
    profileFields.courseDetails = {};

    // since elective is the only optional field, check if its present
    if (req.body.elective)
      profileFields.courseDetails.elective = req.body.elective;

    // loop through courseDetailsFields and add all fields, no need to check
    courseDetailsFields.forEach(field => {
      profileFields.courseDetails[field] = req.body[field];
    });

    // subscription tags from courseDetailsFields
    profileFields.subscriptions.push(req.body.department);
    profileFields.subscriptions.push(req.body.year);
    profileFields.subscriptions.push(`${req.body.year}-${req.body.department}`);
    profileFields.subscriptions.push(req.body.class);
    profileFields.subscriptions.push(req.body.batch);

    // Student council details
    const studentCouncilFields = [
      "IEEE",
      "CSI",
      "ISTE",
      "IETE",
      "ACM",
      "ECELL"
    ];
    profileFields.studentCouncils = {};
    // loop through council fields and add any fields that are present
    studentCouncilFields.forEach(field => {
      if (req.body[field]) {
        profileFields.studentCouncils[field] = req.body[field];
        // add council rank/membership to subscriptions as well
        profileFields.subscriptions.push(`${field}-${req.body[field]}`);
      }
    });

    StudentProfile.findOne({ userKey: req.user.id }).then(profile => {
      if (profile) {
        const errors = {
          existingProfile:
            "profile for this user already exists, try update route"
        };
        return res.status(400).json(errors);
      }
      new StudentProfile(profileFields)
        .save()
        .then(profile => res.status(201).json(profile))
        .catch(err => res.status(400).json(err));
    });
  }
);

// @route   POST /api/profile/create/professor
// @desc    creates professor profile
// @access  Protected
router.post(
  "/create/professor",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //check usertype
    if (req.user.userType !== "professor") {
      return res.status(404).json({
        error:
          "invalid user type. User needs to be a professor to access this route"
      });
    }

    // This route only creates a basic professor profile
    // Separate route for education field
    // Separate route for mentees if any

    const profileFields = {};
    profileFields.subscriptions = ["public", "professors"];

    // Set the userKey and userID from User model stored in req.user
    profileFields.userKey = req.user.id;
    profileFields.userID = req.user.userID;

    // optional fields
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.phone) profileFields.phone = req.body.phone;

    profileFields.department = req.body.department;
    profileFields.designation = req.body.designation;

    // push subscriptions
    profileFields.subscriptions.push(req.body.department);

    ProfessorProfile.findOne({ userKey: req.user.id }).then(profile => {
      if (profile) {
        const errors = {
          existingProfile:
            "profile for this user already exists, try update route"
        };
        return res.status(400).json(errors);
      }
      new ProfessorProfile(profileFields)
        .save()
        .then(profile => res.status(201).json(profile))
        .catch(err => res.status(400).json(err));
    });
  }
);

module.exports = router;
