const { validateReplyContent } = require("../../helpers/validateReply");

describe("validateReplyContent", () => {
  test("should return false for empty content", () => {
    expect(validateReplyContent("")).toBe(false);
  });

  test("should return false for null content", () => {
    expect(validateReplyContent(null)).toBe(false);
  });

  test("should return false for short content", () => {
    expect(validateReplyContent("abcd")).toBe(false);
  });

  test("should return false for long content", () => {
    expect(validateReplyContent("a".repeat(301))).toBe(false);
  });

  test("should return true for valid content", () => {
    expect(validateReplyContent("This is valid content for a reply.")).toBe(
      true
    );
  });
});
