const validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = validateUpdateEduInput = data => {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.field = !isEmpty(data.field) ? data.field : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.to = !isEmpty(data.to) ? data.to : "";
  data.current = !isEmpty(data.current) ? data.current : false;

  // Check school field
  if (validator.isEmpty(data.school)) {
    errors.school = "School name is required";
  }

  // Check degree field
  if (validator.isEmpty(data.degree)) {
    errors.degree = "Degree name is required";
  }

  // Check field field
  if (validator.isEmpty(data.field)) {
    errors.field = "Field of study is required";
  }

  // Check from field
  if (validator.isEmpty(data.from)) {
    errors.from = "Course start year is required";
  }

  if (data.from > data.to) {
    errors.from = "Invalid course start/end dates";
    errors.to = "Invalid course start/end dates";
  }

  if (data.current === false) {
    // Check to field
    if (validator.isEmpty(data.to)) {
      errors.to = "Course end year is required";
    }
  }

  // Set end year to null if its a current course
  if (data.current === true) {
    if (!validator.isEmpty(data.to)) {
      errors.to = "Course cannot end if its currently ongoing";
    }
    data.to = null;
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
