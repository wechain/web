export const extractErrorMessage = function(e) {
  if (e.error_description) {
    const match = e.error_description.match(/.+[A-Z_]+:(.+)/);
    if (match.length > 1) {
      return match[1];
    } else {
      return e.error_description;
    }
  } else {
    return e.message;
  }
}

