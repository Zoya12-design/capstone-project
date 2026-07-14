# WORKFLOW.md — AI-Assisted Workflow Drill (FE-03)

## The Feature
A settings form for the capstone project, with fields for profile name, email, and
notification preferences. Built twice on separate branches: `round1-lazy-prompt`
(one vague sentence) and `round-precise-prompt` (a detailed spec with constraints
and a verification step).

## Round 1 — Lazy Prompt
**Prompt used:** "add a settings form" (single sentence, no context, no constraints).

The AI returned a single static HTML file (`public/settings.html`) styled as a
config-panel UI, with display name, email, theme, and notification fields. It was
explicit that the form was "in-memory only" — settings only logged to the console
on save, with no backend, no persistence, and no validation of any kind. There was
no server endpoint, no error handling, and no tests. The response came back almost
immediately (well under a minute), which made sense given how little there was to
build: a nice-looking shell with no actual logic behind it.

## Round 2 — Precise Prompt
**Prompt used:** specified the exact file to edit (`server.js`, `public/settings.html`),
named the fields, set concrete constraints (react-hook-form + zod equivalent
validation: email format, name minimum 2 characters), asked for an `/api/settings`
endpoint, and required tests to be written and run before considering the task done.

This round took noticeably longer — the agent explored the existing project
structure first, then implemented server-side validation in a separate testable
module, added a settings endpoint, and wrote a dedicated test suite
(`test/validateSettings.test.js`). Running `npm test` confirmed all 7 tests passed,
covering: accepting valid input, trimming whitespace from input, rejecting a
missing or too-short name, rejecting a missing or invalid email, and reporting
multiple validation errors at once.

## Comparison
**Correctness:** Round 2 is the only version with real validation — Round 1 has no
safeguards at all; any input, valid or not, would "succeed" since nothing checks it.

**Edge cases:** Round 2 explicitly handles whitespace-only names, malformed emails,
and multiple simultaneous errors — none of which Round 1 considers, since it has
no validation layer to begin with.

**Review/fixing effort:** Round 1 needed no fixing because there was nothing
functional to break, but it also delivered nothing usable beyond a UI mockup.
Round 2 needed almost no manual fixing either, because the agent verified its own
work with tests before finishing — the "slower" round was actually the one that
required less follow-up work from me.

**Time:** Round 1 was fast to generate (seconds) but not faster end-to-end, since
it isn't a working feature. Round 2 took ~2 minutes to generate but needed zero
additional fixing, making it faster overall once real usage is the goal.

## AI Mistake Caught
In Round 1, the AI silently skipped any backend or validation logic without
flagging it as a limitation up front — it only disclosed this in the explanation
text ("no backend yet"), not in the code itself. Had I only glanced at the visual
result, I could have mistaken a purely cosmetic form for a working feature.
