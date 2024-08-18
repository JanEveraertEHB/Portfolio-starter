function validateThreadTitle(title) {
  if (
    typeof title !== "string" ||
    title.trim().length < 5 ||
    title.trim().length > 50
  ) {
    return false;
  }
  return true;
}

function validateThreadContent(content) {
  if (
    typeof content !== "string" ||
    content.trim().length < 10 ||
    content.trim().length > 500
  ) {
    return false;
  }
  return true;
}

module.exports = {
  validateThreadTitle,
  validateThreadContent,
};
