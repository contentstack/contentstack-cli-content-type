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

### Naming and structure

- Prefer **`it` / `test`** descriptions that state behavior: `should <expected> when <condition>` (or close variants), e.g. `should return sorted titles when order is title`.
- Group related cases with **`describe`** blocks named after the unit under test (module, function, or command behavior).

### What to test (order)

1. **Pure helpers** and **core builders** in `src/core/content-type/` — easiest to drive with inputs and assert outputs.
2. **`src/utils/index.ts`** — mock Management SDK / stack boundaries.
3. **Command classes** — only when needed; they pull in `@contentstack/cli-utilities` (auth, cliux) and need heavier mocks.

In all cases: **pure functions** and **core builders** benefit from inputs/outputs mocked at the boundary; **ContentstackClient** via mock `get` on axios or mock the whole module—**no live CMA** or real stack keys in unit tests. **Commands**: prefer testing **core** and **utils** first; command tests may require heavy mocking of `@contentstack/cli-utilities` (auth, cliux, management SDK).

### Mocking boundaries

- **No live Contentstack API** calls and no real stack keys in unit tests.
- Mock **`ContentstackClient`** (axios), **Management SDK** chains, or **`authenticationHandler`** as in **Jest mocking** below.

### Jest mocking (this repo)

1. **No live API calls** — Do not hit Contentstack Management API or real stacks in unit tests.
2. **Mock at the boundary** — Prefer mocking `ContentstackClient` methods, axios, or `@contentstack/cli-utilities` pieces (e.g. `managementSDKClient`, `authenticationHandler`) when testing command flows.
3. **Coverage** — Follow global thresholds in [jest.config.js](../../jest.config.js) and the summary in [AGENTS.md](../../AGENTS.md).

**Mocking `ContentstackClient`**

Example pattern: spy or replace methods that perform HTTP:

```typescript
import ContentstackClient from '../src/core/contentstack/client'

jest.mock('../src/core/contentstack/client', () => {
  return jest.fn().mockImplementation(() => ({
    getContentTypeAuditLogs: jest.fn().mockResolvedValue({ logs: [] }),
    getContentTypeReferences: jest.fn().mockResolvedValue({}),
  }))
})
```

Adjust import paths to match the file under test. For tests that import the class from the same path as production, use `jest.mock` with the factory before importing the subject.

**Mocking axios**

If testing code that constructs axios directly, use `jest.mock('axios')` and mock `axios.create` to return an instance whose `get`/`post` resolve with fixture data. Align with [src/core/contentstack/client.ts](../../src/core/contentstack/client.ts).

**Management SDK helpers**

[src/utils/index.ts](../../src/utils/index.ts) uses the stack SDK from `managementSDKClient`. In integration-style tests, pass a **fake** `managementSdk` object with `stack().contentType()...` chains that return Promises with fixture data instead of calling real APIs.

**Style**

- Use `describe` / `it` or `test` with clear names: what behavior, under what condition.
- Keep tests **deterministic** — no real network, no reliance on local `csdx` auth state unless explicitly using an e2e harness (not assumed here).

### Commits and CI hygiene

- Do not commit **`describe.only`**, **`it.only`**, **`test.only`**, or **`.skip`** variants.
- Run **`npm test`** before pushing; use **`npm run test:coverage`** when changing core logic to confirm coverage (see [jest.config.js](../../jest.config.js) thresholds and [AGENTS.md](../../AGENTS.md)).

### Coverage goal

- Target and enforcement are documented in [AGENTS.md](../../AGENTS.md) and [jest.config.js](../../jest.config.js).

## References

- [dev-workflow/SKILL.md](../dev-workflow/SKILL.md) — ESLint and CI expectations.
- [AGENTS.md](../../AGENTS.md) — coverage targets and scripts.
