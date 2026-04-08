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

### Highlights

- **Secrets**: Never approve logging of tokens, `authtoken` / `authorization` values, or raw management tokens.
- **Compare / diagram**: Changes to [src/core/content-type/compare.ts](../../src/core/content-type/compare.ts) or [diagram.ts](../../src/core/content-type/diagram.ts) deserve extra scrutiny (temp files, browser open, paths, binary dependency).
- **Dependencies**: axios, diff2html, git-diff, node-graphviz, tmp, cli-ux—review changelog and supply-chain for version bumps.
- **Quality**: TypeScript and **eslint-config-oclif-typescript** ([.eslintrc](../../.eslintrc)); behavioral changes should include or update **Jest** tests where appropriate.

### Full checklist

Use [references/checklist.md](references/checklist.md) for the printable severity-labeled checklist.

## References

- [references/checklist.md](references/checklist.md)
- [testing/SKILL.md](../testing/SKILL.md) — test and lint expectations.
- [contentstack-cli-content-type/SKILL.md](../contentstack-cli-content-type/SKILL.md) — architecture and risky areas.
