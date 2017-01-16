export default ({ username, password, repeatPassword }) => {
  const errors = {};
  if (!username) {
    errors.username = 'Please enter a username';
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
