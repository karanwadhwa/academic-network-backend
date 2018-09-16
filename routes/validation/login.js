const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateLoginInput = data => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Check username field
  if (validator.isEmpty(data.username)) {
    errors.username = "Enter your email or registration number as username";
  }

  // Check password field
  if (validator.isEmpty(data.password)) {
    errors.password = "Enter your password";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
