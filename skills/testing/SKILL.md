---
name: testing
description: >-
  Runs and extends Jest tests for the contentstack-cli-content-type plugin. Use when adding
  or changing tests under tests/, mocking HTTP or ContentstackClient, configuring Jest,
  or running npm test and posttest ESLint.
---

# testing – contentstack-cli-content-type

## When to use

- Adding or changing files under `tests/` or [jest.config.js](../../jest.config.js).
- Mocking `ContentstackClient`, axios, or Management SDK chains.
- Verifying coverage after changes in `src/core/` or `src/utils/`.

## Instructions

### Runner and config

- **Framework**: [Jest](https://jestjs.io/) with **ts-jest** for TypeScript.
- **Config**: [jest.config.js](../../jest.config.js) at repo root — `testMatch` includes `**/tests/**/*.+(ts|tsx)` and common `*.test.ts` / `*.spec.ts` patterns.
- **Test location**: [tests/](../../tests/) (e.g. [tests/commands/content-type/audit.test.ts](../../tests/commands/content-type/audit.test.ts)).

### Scripts

| Script | Behavior |
|--------|----------|
| `npm test` | Runs Jest |
| `npm run test:coverage` | Jest with coverage (see [jest.config.js](../../jest.config.js)) |
| `npm run posttest` | After tests (when invoked via npm lifecycle), ESLint runs per [package.json](../../package.json): `eslint . --ext .ts --config .eslintrc` |

When validating changes, run **`npm test`**; ensure **ESLint** still passes (posttest or `eslint` directly). Use **`npm run test:coverage`** when changing `src/core/` or `src/utils/` behavior.

### What to test

- **Pure functions** and **core builders** in `src/core/content-type/` with inputs/outputs mocked at the boundary.
- **ContentstackClient**: mock `get` on the axios instance or mock the whole module—**no live CMA** or real stack keys in unit tests.
- **Commands**: prefer testing **core** and **utils** first; command tests may require heavy mocking of `@contentstack/cli-utilities` (auth, cliux, management SDK).

## References

- [references/conventions.md](references/conventions.md) — naming, what to test first, no `.only`/`.skip`, coverage goal.
- [references/jest-mocking.md](references/jest-mocking.md) — mocking boundaries and minimal patterns.
- [dev-workflow/SKILL.md](../dev-workflow/SKILL.md) — ESLint and CI expectations.
- [AGENTS.md](../../AGENTS.md) — coverage targets and scripts.
