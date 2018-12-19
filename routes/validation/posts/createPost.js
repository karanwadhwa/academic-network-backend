const validator = require("validator");
const isEmpty = require("../isEmpty");

module.exports = validateCreatePostInput = data => {
  let errors = {};

  data.body = !isEmpty(data.body) ? data.body : "";
  data.audience = !isEmpty(data.audience) ? data.audience : "";

  // Check post body
  if (validator.isEmpty(data.body)) {
    errors.body = "Cant have an empty post";
  }

  // Check password field
  if (validator.isEmpty(data.audience)) {
    errors.audience = "Select the post audience";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
