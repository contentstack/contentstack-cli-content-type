# contentstack-cli-content-type – Agent guide

**Universal entry point** for contributors and AI agents. Detailed conventions live in **`skills/*/SKILL.md`**.

## What this repo is

| Field | Detail |
|-------|--------|
| **Name:** | [contentstack/contentstack-cli-content-type](https://github.com/contentstack/contentstack-cli-content-type) (`contentstack-cli-content-type` on npm) |
| **Purpose:** | Contentstack CLI (`csdx`) plugin that reads Content Type metadata from a stack: list, details, audit logs, same-stack or cross-stack JSON compare (HTML diff), and stack content-model diagrams. |
| **Out of scope (if any):** | Bulk entry/asset mutations, Delivery API consumption, and unrelated HTTP clients—this package focuses on content-type introspection via the Management API patterns documented in the plugin skill. |

## Tech stack (at a glance)

| Area | Details |
|------|---------|
| Language | TypeScript, **`strict`** ([tsconfig.json](tsconfig.json)), target ES2017, CommonJS |
| Build | `tsc -b`; output **`lib/`**; **`npm run prepack`** runs compile + `oclif manifest` + `oclif readme` |
| Tests | Jest + ts-jest; tests under **`tests/`** ([jest.config.js](jest.config.js)) |
| Lint / coverage | ESLint via **`npm run posttest`** ([.eslintrc](.eslintrc)); Jest coverage **`npm run test:coverage`**, global thresholds in [jest.config.js](jest.config.js) |
| CLI / runtime | oclif; Node engines per [package.json](package.json); `bin` is `csdx` when installed as a CLI plugin |

## Commands (quick reference)

| Command type | Command |
|--------------|---------|
| Build (publishable) | `npm run prepack` |
| Test | `npm test` |
| Test + coverage | `npm run test:coverage` |
| Lint | `npm run posttest` (or `eslint . --ext .ts --config .eslintrc`) |

CI: [.github/workflows](.github/workflows) includes policy/SCA/release/issue automation—there is no single `ci.yml` that only runs `npm test`; follow team merge requirements.

## Where the documentation lives: skills

| Skill | Path | What it covers |
|-------|------|----------------|
| Dev workflow | [skills/dev-workflow/SKILL.md](skills/dev-workflow/SKILL.md) | Scripts, `tsconfig`, ESLint, Jest/coverage, oclif README/manifest, PR checks |
| Content Type plugin | [skills/contentstack-cli-content-type/SKILL.md](skills/contentstack-cli-content-type/SKILL.md) | `ContentTypeCommand`, CMA vs SDK, auth, commands, compare/diagram |
| Testing | [skills/testing/SKILL.md](skills/testing/SKILL.md) | Jest layout, mocks, conventions, coverage |
| Code review | [skills/code-review/SKILL.md](skills/code-review/SKILL.md) | PR checklist, security and dependency review |

An index with “when to use” hints is in [skills/README.md](skills/README.md).

## Security

See [SECURITY.md](SECURITY.md) for reporting issues.

## Using Cursor (optional)

If you use **Cursor**, [.cursor/rules/README.md](.cursor/rules/README.md) only points to **[AGENTS.md](AGENTS.md)**—same docs as everyone else.
