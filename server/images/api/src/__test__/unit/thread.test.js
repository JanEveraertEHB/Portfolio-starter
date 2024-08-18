const {
  validateThreadTitle,
  validateThreadContent,
} = require("../../helpers/validateThread");

describe("validateThreadTitle", () => {
  test("should return false for empty title", () => {
    expect(validateThreadTitle("")).toBe(false);
  });

  test("should return false for null title", () => {
    expect(validateThreadTitle(null)).toBe(false);
  });

  test("should return false for short title", () => {
    expect(validateThreadTitle("abcd")).toBe(false);
  });

  test("should return false for long title", () => {
    expect(validateThreadTitle("a".repeat(51))).toBe(false);
  });

  test("should return true for valid title", () => {
    expect(validateThreadTitle("Valid Title")).toBe(true);
  });
});

describe("validateThreadContent", () => {
  test("should return false for empty content", () => {
    expect(validateThreadContent("")).toBe(false);
  });

  test("should return false for null content", () => {
    expect(validateThreadContent(null)).toBe(false);
  });

  test("should return false for short content", () => {
    expect(validateThreadContent("short")).toBe(false);
  });

  test("should return false for long content", () => {
    expect(validateThreadContent("a".repeat(501))).toBe(false);
  });

  test("should return true for valid content", () => {
    expect(validateThreadContent("This is valid content for a thread.")).toBe(
      true
    );
  });
});
