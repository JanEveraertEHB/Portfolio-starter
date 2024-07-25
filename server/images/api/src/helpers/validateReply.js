function validateReplyContent(content) {
  if (
    typeof content !== "string" ||
    content.trim().length < 5 ||
    content.trim().length > 300
  ) {
    return false;
  }
  return true;
}

module.exports = {
  validateReplyContent,
};
