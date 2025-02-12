import validator from 'validator';

export const validateSignup = (values) => {
  const errors = {};

  if (!values.username) {
    errors.username = 'Username is required';
  }

  if (!validator.isEmail(values.email)) {
    errors.email = 'Email address is invalid';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (!validator.isLength(values.password, { min: 6 })) {
    errors.password = 'Password must be at least 6 characters long';
  } else if (
    !/[A-Z]/.test(values.password) || // At least 1 uppercase letter
    !/[a-z]/.test(values.password) || // At least 1 lowercase letter
    !/[0-9]/.test(values.password) || // At least 1 digit
    !/[!@#$%^&*]/.test(values.password) // At least 1 special character
  ) {
    errors.password = 'Password must include at least one uppercase, one lowercase, one digit, and one special character';
  }

  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords must match';
  }

  return errors;
};
