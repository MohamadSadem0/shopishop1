// src/utils/validation.js

export const validateSignup = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Username is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'Passwords must match';
    }
    return errors;
  };
  