const validator = require("validator");
const isEmpty = require("../isEmpty");

const { SMARTCARDID_LENGTH } = process.env;

module.exports = validateCreateStudentInput = data => {
  let errors = {};

  data.smartCardID = !isEmpty(data.smartCardID) ? data.smartCardID : "";
  data.mentorName = !isEmpty(data.mentorName) ? data.mentorName : "";
  data.mentorID = !isEmpty(data.mentorID) ? data.mentorID : "";
  data.department = !isEmpty(data.department) ? data.department : "";
  data.year = !isEmpty(data.year) ? data.year : "";
  data.class = !isEmpty(data.class) ? data.class : "";
  data.rollNo = !isEmpty(data.rollNo) ? data.rollNo : "";
  data.batch = !isEmpty(data.batch) ? data.batch : "";

  // Check smartCardID field
  if (
    !validator.isLength(data.smartCardID, {
      min: Number(SMARTCARDID_LENGTH),
      max: Number(SMARTCARDID_LENGTH)
    })
  ) {
    errors.smartCardID = "Enter a valid Smart Card no.";
  }
  if (validator.isEmpty(data.smartCardID)) {
    errors.smartCardID = "Student Smart Card no. is required";
  }

  // Check Mentor fields
  if (validator.isEmpty(data.mentorName)) {
    errors.mentorName = "Mentor name is required";
  }
  if (!/^[a-zA-Z]{1}\d{3}$/.test(data.mentorID)) {
    errors.mentorID = "Invalid Staff id";
  }
  if (validator.isEmpty(data.mentorID)) {
    errors.mentorID = "Mentors Staff id is required";
  }

  // Check courseDetails fields
  if (validator.isEmpty(data.department)) {
    errors.department = "Select your department";
  }

  if (validator.isEmpty(data.year)) {
    errors.year = "Select course year";
  }

  if (validator.isEmpty(data.class)) {
    errors.class = "Select your class";
  }

  if (validator.isEmpty(data.rollNo)) {
    errors.rollNo = "Enter your Roll no.";
  }

  if (validator.isEmpty(data.batch)) {
    errors.batch = "Select your batch";
  }

  /*   // Check elective field if it exists
  if (!isEmpty(data.elective)) {
    if (!validator.isAlpha(data.elective)) {
      errors.phone = "Invalid elective choice";
    }
  } */

  // Check phone field if it exists
  if (!isEmpty(data.phone)) {
    if (!validator.isInt(data.phone)) {
      errors.phone = "Enter your 10 digit phone no.";
    }

    if (!validator.isLength(data.phone, { min: 10, max: 10 })) {
      errors.phone = "Enter your 10 digit phone no.";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
