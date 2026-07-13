const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { validateSettings } = require("../lib/validateSettings");

describe("validateSettings", () => {
  it("accepts valid input", () => {
    const result = validateSettings({
      displayName: "Jane Doe",
      email: "jane@example.com",
    });

    assert.equal(result.valid, true);
    assert.deepEqual(result.errors, {});
    assert.equal(result.values.displayName, "Jane Doe");
    assert.equal(result.values.email, "jane@example.com");
  });

  it("trims whitespace from valid input", () => {
    const result = validateSettings({
      displayName: "  Alex  ",
      email: "  alex@example.com  ",
    });

    assert.equal(result.valid, true);
    assert.equal(result.values.displayName, "Alex");
    assert.equal(result.values.email, "alex@example.com");
  });

  it("rejects missing profile name", () => {
    const result = validateSettings({
      displayName: "",
      email: "jane@example.com",
    });

    assert.equal(result.valid, false);
    assert.equal(result.errors.displayName, "Profile name is required.");
  });

  it("rejects profile name shorter than 2 characters", () => {
    const result = validateSettings({
      displayName: "A",
      email: "jane@example.com",
    });

    assert.equal(result.valid, false);
    assert.equal(
      result.errors.displayName,
      "Profile name must be at least 2 characters."
    );
  });

  it("rejects missing email", () => {
    const result = validateSettings({
      displayName: "Jane Doe",
      email: "",
    });

    assert.equal(result.valid, false);
    assert.equal(result.errors.email, "Email is required.");
  });

  it("rejects invalid email format", () => {
    const invalidEmails = ["not-an-email", "missing@domain", "@example.com", "user@"];

    for (const email of invalidEmails) {
      const result = validateSettings({
        displayName: "Jane Doe",
        email,
      });

      assert.equal(result.valid, false, `expected "${email}" to be invalid`);
      assert.equal(result.errors.email, "Enter a valid email address.");
    }
  });

  it("reports multiple validation errors at once", () => {
    const result = validateSettings({
      displayName: " ",
      email: "bad-email",
    });

    assert.equal(result.valid, false);
    assert.equal(result.errors.displayName, "Profile name is required.");
    assert.equal(result.errors.email, "Enter a valid email address.");
  });
});
