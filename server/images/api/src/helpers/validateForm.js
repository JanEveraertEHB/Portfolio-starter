/**
 * Validate username
 * @param {string} username - The username to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateUsername(username) {
  if (
    username == null ||
    typeof username !== "string" ||
    username.length < 3 ||
    username.length > 20
  ) {
    return false;
  }
  return true;
}

/**
 * Validate password
 * @param {string} password - The password to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validatePassword(password) {
  if (
    password == null ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 50
  ) {
    return false;
  }
  return true;
}

module.exports = {
  validateUsername,
  validatePassword,
};
