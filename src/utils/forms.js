import validator from "validator";

export const validateRegistrationForm = data => {
  const errors = {};
  for (const key in data) {
    switch (key) {
      case "password":
        if (data[key].length < 8) {
          errors.password = "Password needs to be at least 8 characters";
        }
        break;
      case "confirmPassword":
        if (data[key] !== data.password) {
          errors.confirmPassword = "Passwords do not match";
        }
        break;
      case "email":
        if (!validator.isEmail(data[key])) {
          errors.email = "Not a valid email";
        }
        break;
      case "username":
        if (data[key].length < 6) {
          errors.username = "Username needs to be at least 6 characters";
        }
        break;
      default:
        break;
    }
  }

  return errors;
};
