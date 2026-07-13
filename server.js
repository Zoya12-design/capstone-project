const express = require("express");
const path = require("path");
const { validateSettings } = require("./lib/validateSettings");

const app = express();
const PORT = process.env.PORT || 3000;

let settings = {
  displayName: "",
  email: "",
  emailNotifications: true,
};

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/settings", (_req, res) => {
  res.json(settings);
});

app.put("/api/settings", (req, res) => {
  const { displayName, email, emailNotifications } = req.body;
  const result = validateSettings({ displayName, email });

  if (!result.valid) {
    const messages = Object.values(result.errors);
    return res.status(400).json({
      error: messages[0],
      errors: result.errors,
    });
  }

  settings = {
    displayName: result.values.displayName,
    email: result.values.email,
    emailNotifications: Boolean(emailNotifications),
  };

  res.json({ message: "Settings saved.", settings });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = { app, validateSettings };
