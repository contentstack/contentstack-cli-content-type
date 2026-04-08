---
name: code-review
description: >-
  Reviews pull requests and risky changes for the contentstack-cli-content-type plugin.
  Use when reviewing diffs, security-sensitive edits, dependency upgrades, or changes to
  compare/diagram/temp-file behavior, ESLint, and tests.
---

# code-review – contentstack-cli-content-type

## When to use

- Reviewing a PR or diff before merge.
- Auditing dependency upgrades (axios, diff2html, git-diff, node-graphviz, tmp, cli-ux).
- Changes touching compare HTML, temp files, diagram output, or `src/core/contentstack/`.

## Instructions

Provide consistent **security**, **correctness**, and **maintainability** review for this repository. The plugin handles stack API keys in error messages, opens **HTML** diffs in a browser, and writes **diagram** files via Graphviz.

Use **Critical** / **Important** / **Suggestion** when leaving feedback.

### Highlights

- **Secrets**: Never approve logging of tokens, `authtoken` / `authorization` values, or raw management tokens.
- **Compare / diagram**: Changes to [src/core/content-type/compare.ts](../../src/core/content-type/compare.ts) or [diagram.ts](../../src/core/content-type/diagram.ts) deserve extra scrutiny (temp files, browser open, paths, binary dependency).
- **Dependencies**: axios, diff2html, git-diff, node-graphviz, tmp, cli-ux—review changelog and supply-chain for version bumps.
- **Quality**: TypeScript and **eslint-config-oclif-typescript** ([.eslintrc](../../.eslintrc)); behavioral changes should include or update **Jest** tests where appropriate.

### Security and privacy

| Severity | Item |
|----------|------|
| Critical | No logging or serializing of **access tokens**, **management tokens**, or **Bearer** strings. |
| Critical | No new `console.log` of full API responses that may contain secrets. |
| Important | Stack API keys appear in user-facing errors only in line with [src/core/contentstack/client.ts](../../src/core/contentstack/client.ts) (`buildError` + optional key suffix). |

### Correctness

| Severity | Item |
|----------|------|
| Critical | Command flags and `setup(flags)` behavior remain consistent; **compare-remote** still resolves origin vs remote stacks correctly. |
| Important | **Compare**: left/right version logic and warning when versions are equal; HTML output path and browser open behavior unchanged unless intentionally redesigned. |
| Important | **Diagram**: output path validation; Graphviz / DOT paths; orientation and file type flags. |
| Suggestion | Edge cases for empty audit logs, missing references, or single-version content types. |

### Compare and diagram (touching core)

| Severity | Item |
|----------|------|
| Critical | [compare.ts](../../src/core/content-type/compare.ts): temp HTML creation does not write sensitive data beyond the diff; file handling is safe on failure paths. |
| Important | [diagram.ts](../../src/core/content-type/diagram.ts): `sanitizePath` / path usage; large stack models do not cause unbounded memory without consideration. |
| Suggestion | User messaging when Graphviz is missing or SVG generation fails. |

### Dependencies

| Severity | Item |
|----------|------|
| Important | **axios**: security advisories; upgrade notes. |
| Important | **diff2html**, **git-diff**, **tmp**, **cli-ux**: behavior changes affecting compare UX. |
| Important | **node-graphviz**: compatibility with supported Node and system Graphviz. |
| Suggestion | **moment** (if touched): prefer minimal churn; note maintenance status of dependencies. |

### Tests and tooling

| Severity | Item |
|----------|------|
| Important | New behavior in `src/core/` or `src/utils/` has **Jest** coverage or a clear reason why not. |
| Important | `npm test` and **ESLint** (`posttest` / [`.eslintrc`](../../.eslintrc)) pass. |
| Suggestion | Tests mock HTTP/SDK boundaries; no accidental live API calls. |

### Documentation

| Severity | Item |
|----------|------|
| Important | If commands or flags change, **README** (generated via `oclif readme`) is updated via `prepack` / `version` workflow. |
| Suggestion | User-facing strings and examples match `src/commands/content-type/*.ts` examples. |

## References

- [testing/SKILL.md](../testing/SKILL.md) — test and lint expectations.
- [contentstack-cli-content-type/SKILL.md](../contentstack-cli-content-type/SKILL.md) — architecture and risky areas.
