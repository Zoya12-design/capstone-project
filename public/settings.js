const form = document.getElementById("settings-form");
const statusMessage = document.getElementById("status-message");
const emptyState = document.getElementById("empty-state");
const loadError = document.getElementById("load-error");
const loadingState = document.getElementById("loading-state");

const fields = {
  displayName: document.getElementById("displayName"),
  email: document.getElementById("email"),
  emailNotifications: document.getElementById("emailNotifications"),
};

function showStatus(message, type) {
  statusMessage.textContent = message;
  statusMessage.className = type ? `status-message ${type}` : "status-message";
}

function clearErrors() {
  form.querySelectorAll(".error").forEach((el) => {
    el.textContent = "";
  });
  form.querySelectorAll(".invalid").forEach((el) => {
    el.classList.remove("invalid");
  });
}

function setFieldError(name, message) {
  fields[name].classList.add("invalid");
  form.querySelector(`[data-for="${name}"]`).textContent = message;
}

function applyServerErrors(errors) {
  clearErrors();
  if (!errors) return;
  Object.entries(errors).forEach(([name, message]) => {
    if (fields[name]) {
      setFieldError(name, message);
    }
  });
}

function validateForm(data) {
  clearErrors();
  let valid = true;

  if (!data.displayName.trim()) {
    setFieldError("displayName", "Profile name is required.");
    valid = false;
  } else if (data.displayName.trim().length < 2) {
    setFieldError("displayName", "Profile name must be at least 2 characters.");
    valid = false;
  }

  if (!data.email.trim()) {
    setFieldError("email", "Email is required.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    setFieldError("email", "Enter a valid email address.");
    valid = false;
  }

  return valid;
}

function updateEmptyState(settings) {
  const isEmpty = !settings.displayName && !settings.email;
  emptyState.hidden = !isEmpty;
}

function populateForm(settings) {
  fields.displayName.value = settings.displayName || "";
  fields.email.value = settings.email || "";
  fields.emailNotifications.checked = Boolean(settings.emailNotifications);
  fields.emailNotifications.setAttribute(
    "aria-checked",
    String(fields.emailNotifications.checked)
  );
  updateEmptyState(settings);
}

function showForm() {
  loadingState.hidden = true;
  form.hidden = false;
}

function showLoadError() {
  loadingState.hidden = true;
  loadError.hidden = false;
}

async function loadSettings() {
  try {
    const response = await fetch("/api/settings");
    if (!response.ok) throw new Error("Failed to load settings.");
    const settings = await response.json();
    populateForm(settings);
    showForm();
  } catch {
    showLoadError();
  }
}

fields.emailNotifications.addEventListener("change", (event) => {
  event.target.setAttribute("aria-checked", String(event.target.checked));
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = {
    displayName: fields.displayName.value,
    email: fields.email.value,
    emailNotifications: fields.emailNotifications.checked,
  };

  if (!validateForm(data)) {
    showStatus("Please fix the errors below.", "error");
    return;
  }

  const submitButton = form.querySelector('[type="submit"]');
  submitButton.disabled = true;
  showStatus("Saving…", "");

  try {
    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      applyServerErrors(result.errors);
      showStatus(result.error || "Failed to save settings.", "error");
      return;
    }

    populateForm(result.settings);
    showStatus("Settings saved successfully.", "success");
  } catch {
    showStatus("Something went wrong. Please try again.", "error");
  } finally {
    submitButton.disabled = false;
  }
});

loadSettings();
