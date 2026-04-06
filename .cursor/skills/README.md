# Project skills (contentstack-cli-content-type)

Cursor loads **project skills** from `.cursor/skills/<skill-name>/SKILL.md`. Each folder below is one skill; open `SKILL.md` for instructions and follow links into `references/` for detail.

| Skill folder | Purpose | When to load |
|--------------|---------|----------------|
| [contentstack-cli-content-type](contentstack-cli-content-type/SKILL.md) | Plugin architecture, `ContentTypeCommand`, CMA client, commands, build/readme workflow | Editing `src/commands`, `src/core`, `src/utils`, auth, compare/diagram behavior, oclif |
| [testing](testing/SKILL.md) | Jest, `tests/`, mocking, `npm test` / `test:coverage` / ESLint posttest; see `references/conventions.md` | Adding or changing tests, Jest config, mocks |
| [review](review/SKILL.md) | PR review checklist and risk areas | Reviewing PRs, dependency bumps, security-sensitive edits |

Use the skill whose **description** frontmatter best matches the task; combine **testing** with **contentstack-cli-content-type** when implementing features that need tests.
