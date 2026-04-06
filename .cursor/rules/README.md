# Cursor rules (contentstack-cli-content-type)

Rules are `.mdc` files under `.cursor/rules/`. For each rule here, **`alwaysApply` is `false`**: Cursor applies it when files matching **`globs`** are in context (open or relevant to the task).

| Rule file | Globs | Purpose | Related skill |
|-----------|--------|---------|----------------|
| [dev-workflow.mdc](dev-workflow.mdc) | `src/**/*.ts`, `tests/**/*.ts`, `package.json`, `jest.config.js` | Run `npm test` / ESLint / `test:coverage` before PR; oclif docs when commands change | [AGENTS.md](../../AGENTS.md), [.cursor/skills/testing/SKILL.md](../skills/testing/SKILL.md) |
| [content-type-plugin.mdc](content-type-plugin.mdc) | `src/commands/**`, `src/core/**`, `src/utils/**`, `src/types/**`, `src/config/**` | OCLIF commands, `ContentTypeCommand`, utils/types/config, Management SDK + axios client, no secret logging, `oclif readme` when commands change | [.cursor/skills/contentstack-cli-content-type/SKILL.md](../skills/contentstack-cli-content-type/SKILL.md) |
| [testing.mdc](testing.mdc) | `tests/**/*.ts`, `jest.config.js` | Jest + ts-jest, mock boundaries, `npm test` / posttest ESLint | [.cursor/skills/testing/SKILL.md](../skills/testing/SKILL.md) |
| [review.mdc](review.mdc) | `compare.ts`, `diagram.ts`, `src/core/contentstack/**`, `package.json` | Security and PR review highlights for high-risk paths and dependency changes | [.cursor/skills/review/SKILL.md](../skills/review/SKILL.md) |
| [typescript-build.mdc](typescript-build.mdc) | `tsconfig.json` | `strict`, `rootDir`/`outDir`, `tsc -b` / prepack alignment | [.cursor/skills/contentstack-cli-content-type/SKILL.md](../skills/contentstack-cli-content-type/SKILL.md) |
| [eslint-config.mdc](eslint-config.mdc) | `.eslintrc` | oclif-typescript style, posttest eslint expectations | — |
| [oclif-docs.mdc](oclif-docs.mdc) | `README.md`, `oclif.manifest.json` | Regenerate command docs/manifest via `oclif readme` / `oclif manifest` after command changes | [.cursor/skills/contentstack-cli-content-type/SKILL.md](../skills/contentstack-cli-content-type/SKILL.md) |

See also [.cursor/skills/README.md](../skills/README.md) for the full skill index.
