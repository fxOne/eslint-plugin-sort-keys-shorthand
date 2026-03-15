---
"eslint-plugin-sort-keys-shorthand": major
---

Add ESLint 10 support. This is a breaking change — ESLint 9 is no longer supported.

- Replace deprecated `context.getSourceCode()` with `context.sourceCode` (fixes #96)
- Update peer dependency to `eslint ^10.0.0`
- Update all dev dependencies to latest versions
- Migrate from yarn to pnpm
