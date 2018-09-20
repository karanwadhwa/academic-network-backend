const validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = validateRegisterInput = data => {
  let errors = {};

  data.fname = !isEmpty(data.fname) ? data.fname : "";
  data.lname = !isEmpty(data.lname) ? data.lname : "";
  data.userID = !isEmpty(data.userID) ? data.userID : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.userType = !isEmpty(data.userType) ? data.userType : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // Check firstname field
  if (!validator.isAlpha(data.fname.trim())) {
    errors.fname = "First Name cannot contain spaces or special characters";
  }
  if (!validator.isLength(data.fname.trim(), { min: 2, max: 20 })) {
    errors.fname = "First Name must be between 2 and 20 characters";
  }

  // Check lastname field
  if (!validator.isAlpha(data.lname.trim())) {
    errors.lname = "Last Name cannot contain spaces or special characters";
  }
  if (!validator.isLength(data.lname.trim(), { min: 2, max: 20 })) {
    errors.lname = "Last Name must be between 2 and 20 characters";
  }

  // Check registration number
  if (
    !validator.isInt(data.userID, {
      min: Number(process.env.REG_NO_LOWER_LIMIT),
      max: Number(process.env.REG_NO_UPPER_LIMIT)
    }) &&
    !/([a-zA-Z]{1}[0-9]{3})/.test(data.userID)
  ) {
    errors.userID = "Enter a valid Registration number or Staff ID";
  }

  // Check email field
  if (!validator.isEmail(data.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!data.email.toLowerCase().includes(process.env.EMAIL_DOMAIN)) {
    errors.email = "Enter your college-assigned email id";
  }

  // Check user type
  if (validator.isEmpty(data.userType)) {
    errors.userType = "User Type is required";
  }

  // Check and Match passwords
  if (!validator.isLength(data.password, { min: 8, max: 50 })) {
    errors.password = "Minimum password length is 8 characters";
  }
  if (
    data.password.toLowerCase().includes(data.fname) ||
    data.password.toLowerCase().includes(data.lname)
  ) {
    errors.password = "Password cannot contain your name";
  }

  // Match passwords
  if (!validator.equals(data.password, data.password2)) {
    errors.password = "Passwords don't match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
