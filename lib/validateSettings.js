const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateSettings({ displayName, email }) {
  const errors = {};

  const name = displayName == null ? "" : String(displayName).trim();
  const emailValue = email == null ? "" : String(email).trim();

  if (!name) {
    errors.displayName = "Profile name is required.";
  } else if (name.length < 2) {
    errors.displayName = "Profile name must be at least 2 characters.";
  }

  if (!emailValue) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(emailValue)) {
    errors.email = "Enter a valid email address.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    values: {
      displayName: name,
      email: emailValue,
    },
  };
}

module.exports = { validateSettings, EMAIL_REGEX };
