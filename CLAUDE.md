# CLAUDE.md

## Project Overview
This is a capstone project repository for the AI Fluency track (FE-01: Environment and AI toolchain).

## Tech Stack
- Node.js (LTS)
- Git for version control
- Cursor as the AI-assisted code editor

## Conventions
- Commit messages follow the Conventional Commits format (e.g., `feat:`, `docs:`, `chore:`, `fix:`)
- Keep the README.md up to date as the project evolves
- Use clear, descriptive variable and function names
 
 ##3rules
 ## Rules learned from AI-assisted workflow drill (FE-03)

- Never accept AI-generated code without a validation/error-handling layer —
  always explicitly require server-side validation (required fields, format
  checks, length limits) rather than assuming the AI added it by default.
- Every feature involving user input must ship with tests that are actually
  run before the task is considered done, not just written and assumed to pass.
- When prompting for a feature, always specify the exact file(s) to edit, the
  library/pattern to use, and at least one example of expected behavior —
  vague one-line prompts produce UI-only mockups with no real logic behind them.