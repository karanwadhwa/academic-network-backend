const express = require("express");
const passport = require("passport");

// Import Models
const User = require("../../models/User");
const StudentProfile = require("../../models/StudentProfile");
const ProfessorProfile = require("../../models/ProfessorProfile");

// Load Input Validaton
const validateCreateStudentInput = require("../validation/profile/createStudent");
const validateCreateProfessorInput = require("../validation/profile/createProfessor");
const validateUpdateMenteeInput = require("../validation/profile/updateMentee");
const validateUpdateEduInput = require("../validation/profile/updateEdu");

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

    // Input Validation
    const { errors, isValid } = validateCreateStudentInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const profileFields = {};
    const newSubs = ["public", "students"];

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
    newSubs.push(req.body.department);
    newSubs.push(req.body.year);
    newSubs.push(`${req.body.year}-${req.body.department}`);
    newSubs.push(req.body.class);
    newSubs.push(req.body.batch);

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
        // add council rank/membership to newSubs as well
        newSubs.push(`${field}-${req.body[field]}`);
      }
    });

    StudentProfile.findOne({ userKey: req.user.id })
      .then(profile => {
        if (profile) {
          const errors = {
            existingProfile:
              "profile for this user already exists, try update route"
          };
          return res.status(400).json(errors);
        }
        new StudentProfile(profileFields)
          .save()
          .then(profile => {
            User.findByIdAndUpdate(
              req.user.id,
              { $addToSet: { subscriptions: newSubs } },
              // to avoid DeprecationWarning: collection.findAndModify is deprecated.
              { new: true, useFindAndModify: false },
              (err, user) => {
                if (err) console.log(err);
                res.status(201).json({
                  user: {
                    fname: user.fname,
                    lname: user.lname,
                    subscriptions: user.subscriptions,
                    audience: user.audience
                  },
                  profile
                });
              }
            );
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
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

    // Input Validation
    const { errors, isValid } = validateCreateProfessorInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // This route only creates a basic professor profile
    // Separate route for education field
    // Separate route for mentees if any

    const profileFields = {};
    const newSubs = ["public", "professors"];

    // Set the userKey and userID from User model stored in req.user
    profileFields.userKey = req.user.id;
    profileFields.userID = req.user.userID;

    // optional fields
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.phone) profileFields.phone = req.body.phone;

    profileFields.department = req.body.department;
    profileFields.designation = req.body.designation;

    // push newSubs
    newSubs.push(req.body.department);

    ProfessorProfile.findOne({ userKey: req.user.id })
      .then(profile => {
        if (profile) {
          const errors = {
            existingProfile:
              "profile for this user already exists, try update route"
          };
          return res.status(400).json(errors);
        }
        new ProfessorProfile(profileFields)
          .save()
          .then(profile => {
            User.findByIdAndUpdate(
              req.user.id,
              { $addToSet: { subscriptions: newSubs } },
              // to avoid DeprecationWarning: collection.findAndModify is deprecated.
              { new: true, useFindAndModify: false },
              (err, user) => {
                if (err) console.log(err);
                res.status(201).json({
                  user: {
                    fname: user.fname,
                    lname: user.lname,
                    subscriptions: user.subscriptions,
                    audience: user.audience
                  },
                  profile
                });
              }
            );
          })
          .catch(err => res.status(400).json(err));
      })
      .catch(err => res.status(400).json(err));
  }
);

// @route   POST /api/profile/update/professor/mentee
// @desc    assign mentees to the logged in professor
// @access  Protected
router.post(
  "/update/professor/mentee",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.userType !== "professor") {
      return res.status(404).json({
        error:
          "invalid user type. User needs to be a professor to access this route"
      });
    }

    // Input Validation
    const { errors, isValid } = validateUpdateMenteeInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    ProfessorProfile.findOne({ userKey: req.user.id }).then(profile => {
      const newMentee = {
        name: req.body.name,
        userID: req.body.userID,
        smartCardID: req.body.smartCardID,
        phone: req.body.phone,
        email: req.body.email
      };

      // Add to mentee array
      profile.mentees.push(newMentee);

      profile.save().then(profile => res.status(201).json(profile));
    });
  }
);

// @route   POST /api/profile/update/professor/education
// @desc    add qualifications to the logged in professor
// @access  Protected
router.post(
  "/update/professor/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.userType !== "professor") {
      return res.status(404).json({
        error:
          "invalid user type. User needs to be a professor to access this route"
      });
    }

    // Input Validation
    const { errors, isValid } = validateUpdateEduInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    ProfessorProfile.findOne({ userKey: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        field: req.body.field,
        from: req.body.from
      };

      if (req.body.to) newEdu.to = req.body.to;
      if (req.body.current) newEdu.current = req.body.current;

      // Add to mentee array
      profile.education.push(newEdu);

      profile.save().then(profile => res.status(201).json(profile));
    });
  }
);

module.exports = router;
