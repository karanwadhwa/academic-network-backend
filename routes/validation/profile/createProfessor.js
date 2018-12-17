const validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = validateCreateProfessorInput = data => {
  let errors = {};

  data.department = !isEmpty(data.department) ? data.department : "";
  data.designation = !isEmpty(data.designation) ? data.designation : "";

  // Check department field
  if (validator.isEmpty(data.department)) {
    errors.department = "Enter your department";
  }

  // Check department field
  if (validator.isEmpty(data.designation)) {
    errors.designation = "Enter your designation";
  }

  // Check phone field if it exists
  if (!isEmpty(data.phone)) {
    if (!validator.isInt(data.phone)) {
      errors.phone = "Enter 10 digit phone no. without country code or spaces";
    }

    if (!validator.isLength(data.phone, { min: 10, max: 10 })) {
      errors.phone = "Enter 10 digit phone no. without country code or spaces";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
