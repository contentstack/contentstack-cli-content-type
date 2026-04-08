# Testing conventions

## Naming

- Prefer **`it` / `test`** descriptions that state behavior: `should <expected> when <condition>` (or close variants), e.g. `should return sorted titles when order is title`.
- Group related cases with **`describe`** blocks named after the unit under test (module, function, or command behavior).

## What to test first

1. **Pure helpers** and **core builders** in `src/core/content-type/` — easiest to drive with inputs and assert outputs.
2. **`src/utils/index.ts`** — mock Management SDK / stack boundaries.
3. **Command classes** — only when needed; they pull in `@contentstack/cli-utilities` (auth, cliux) and need heavier mocks.

## Mocking boundaries

- **No live Contentstack API** calls and no real stack keys in unit tests.
- Mock **`ContentstackClient`** (axios), **Management SDK** chains, or **`authenticationHandler`** as described in [jest-mocking.md](jest-mocking.md).

## Commits and CI hygiene

- Do not commit **`describe.only`**, **`it.only`**, **`test.only`**, or **`.skip`** variants.
- Run **`npm test`** before pushing; use **`npm run test:coverage`** when changing core logic to confirm coverage (see [jest.config.js](../../../jest.config.js) thresholds and [AGENTS.md](../../../AGENTS.md)).

## Coverage goal

- Target and enforcement are documented in [AGENTS.md](../../../AGENTS.md) and [jest.config.js](../../../jest.config.js).
