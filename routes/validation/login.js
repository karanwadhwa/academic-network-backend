const validator = require("validator");
const isEmpty = require("./isEmpty");

const { EMAIL_DOMAIN, REG_NO_LOWER_LIMIT, REG_NO_UPPER_LIMIT } = process.env;

module.exports = validateLoginInput = data => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Check username field
  if (
    !validator.isInt(data.username, {
      min: REG_NO_LOWER_LIMIT,
      max: REG_NO_UPPER_LIMIT
    }) &&
    !validator.isEmail(data.username) &&
    !data.username.toLowerCase().includes(EMAIL_DOMAIN)
  ) {
    errors.username = "Enter your email or registration number as username";
  }
  if (validator.isEmpty(data.username)) {
    errors.username = "Username is required";
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
