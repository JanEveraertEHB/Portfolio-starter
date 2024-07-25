const {
  validateUsername,
  validatePassword,
} = require("../../helpers/validateForm");

// Test cases for validateUsername
test("validate username", () => {
  expect(validateUsername("")).toBe(false);
  expect(validateUsername(null)).toBe(false);
  expect(validateUsername("ab")).toBe(false);
  expect(validateUsername(123)).toBe(false);
  expect(
    validateUsername("thisisaverylongusernamethatexceedstwentycharacters")
  ).toBe(false);
  expect(validateUsername("validUser")).toBe(true);
  expect(validateUsername("user123")).toBe(true);
});

// Test cases for validatePassword
test("validate password", () => {
  expect(validatePassword("")).toBe(false);
  expect(validatePassword(null)).toBe(false);
  expect(validatePassword("short")).toBe(false);
  expect(validatePassword(12345678)).toBe(false);
  expect(
    validatePassword(
      "thisisaverylongpasswordthatexceedsthefiftycharacterlimitandshouldfail"
    )
  ).toBe(false);
  expect(validatePassword("validPassword123")).toBe(true);
  expect(validatePassword("anotherValidPassword!")).toBe(true);
});
