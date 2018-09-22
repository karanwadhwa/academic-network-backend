const validator = require("validator");
const isEmpty = require("./isEmpty");

const { EMAIL_DOMAIN, REG_NO_LOWER_LIMIT, REG_NO_UPPER_LIMIT } = process.env;

module.exports = validateLoginInput = data => {
  let errors = {};

  data.username = !isEmpty(data.username) ? data.username : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // Check username field
  if (
    // check if username is student registration no
    !validator.isInt(data.username, {
      min: REG_NO_LOWER_LIMIT,
      max: REG_NO_UPPER_LIMIT
    }) &&
    // check if username is staff id
    /^[a-zA-Z]{1}\d{3}$/.test(data.userID) &&
    // check if username is college issued email
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
