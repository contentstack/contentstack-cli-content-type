# contentstack-cli-content-type

TypeScript npm package: a **Contentstack CLI** (`csdx`) plugin that reads Content Type metadata from a stack—list, field details, audit log lines, same-stack or cross-stack comparison, and stack content-model diagrams. It does not perform bulk mutations on entries or assets.

## Stack

- **Language**: TypeScript (`strict` in [tsconfig.json](tsconfig.json))
- **CLI**: oclif; commands under `src/commands/content-type/`
- **Tests**: Jest + ts-jest; tests under `tests/` (see [jest.config.js](jest.config.js))
- **Core logic**: `src/core/content-type/`, shared command base in `src/core/command.ts`, HTTP in `src/core/contentstack/`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm test` | Run Jest |
| `npm run posttest` | ESLint on `.ts` files (see [package.json](package.json)) |
| `npm run test:coverage` | Jest with coverage; terminal summary plus **HTML** report at `coverage/lcov-report/index.html` (see [jest.config.js](jest.config.js)) |
| `npm run prepack` | `tsc -b`, `oclif manifest`, `oclif readme` — run when commands, flags, or descriptions change |

## Workflow

- Prefer adding or updating tests for behavioral changes in `src/core/` and `src/utils/`.
- Do not commit `test.only` / `test.skip` (or `describe.only` / `it.only`).
- After changing command IDs, flags, or help text, regenerate CLI docs so `README.md` and `oclif.manifest.json` stay aligned (see `prepack` / `version` in [package.json](package.json)).

## Coverage

- **Target**: **80%** minimum on statements, branches, functions, and lines.
- **Enforcement**: [jest.config.js](jest.config.js) sets **global** `coverageThreshold` at **80%** for all four metrics. Run `npm run test:coverage` so thresholds apply.
- **HTML report**: after `npm run test:coverage`, open `coverage/lcov-report/index.html` in a browser. The `coverage/` directory is gitignored.

## Security

See [SECURITY.md](SECURITY.md) for reporting issues.

## Cursor: rules and skills

- **Rules index**: [.cursor/rules/README.md](.cursor/rules/README.md) — context-specific `.mdc` rules.
- **Skills index**: [.cursor/skills/README.md](.cursor/skills/README.md) — `ContentTypeCommand`, CMA client, testing, PR review.

For detailed plugin architecture and commands, start with [.cursor/skills/contentstack-cli-content-type/SKILL.md](.cursor/skills/contentstack-cli-content-type/SKILL.md).
