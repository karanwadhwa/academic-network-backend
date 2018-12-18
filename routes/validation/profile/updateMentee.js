const validator = require("validator");
const isEmpty = require("../isEmpty");

const {
  EMAIL_DOMAIN,
  REG_NO_LOWER_LIMIT,
  REG_NO_UPPER_LIMIT,
  SMARTCARDID_LENGTH
} = process.env;

module.exports = validateUpdateMenteeInput = data => {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.userID = !isEmpty(data.userID) ? data.userID : "";
  data.smartCardID = !isEmpty(data.smartCardID) ? data.smartCardID : "";
  data.phone = !isEmpty(data.phone) ? data.phone : "";
  data.email = !isEmpty(data.email) ? data.email : "";

  // Check name field
  if (validator.isEmpty(data.name)) {
    errors.name = "Mentee name is required";
  }

  // Check userID field
  if (
    // check if username is student registration no
    !validator.isInt(data.userID, {
      min: Number(REG_NO_LOWER_LIMIT),
      max: Number(REG_NO_UPPER_LIMIT)
    })
  ) {
    errors.userID = "Invalid student Registration no.";
  }
  if (validator.isEmpty(data.userID)) {
    errors.userID = "Student Registration no. is required";
  }

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

  // Check phone field
  if (validator.isEmpty(data.phone)) {
    errors.phone = "Student phone is required";
  }
  if (!validator.isInt(data.phone)) {
    errors.phone = "Enter your 10 digit phone no.";
  }
  if (!validator.isLength(data.phone, { min: 10, max: 10 })) {
    errors.phone = "Enter your 10 digit phone no.";
  }

  // Check email field
  if (validator.isEmpty(data.email)) {
    errors.email = "Mentee email is required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "Enter a valid email address";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
