import validator from 'validator';

export default ({ email, password, repeatPassword }) => {
  const errors = {};
  if (!email || !validator.isEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!password) {
    errors.password = 'Please enter a password';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  } else if (password.length > 64) {
    errors.password = 'Password cannot be longer than 64 characters';
  }
  if (!repeatPassword) {
    errors.repeatPassword = 'Please re-enter your password';
  } else if (password !== repeatPassword) {
    errors.repeatPassword = 'Passwords must be the same';
  }
  return errors;
};
