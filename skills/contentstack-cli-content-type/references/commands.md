# Commands reference

Primary sources: `README.md` and `src/commands/content-type/*.ts`.

## `content-type:list`

- **Flags**: `--stack-api-key` (`-k`), `--stack` (deprecated → use stack key), `--token-alias` / `--alias` (`-a`), `--order` (`-o`) `title` | `modified` (default `title`).
- **Files**: `src/commands/content-type/list.ts`, `src/core/content-type/list.ts`.
- **Behavior**: Lists Content Types for the stack; table output via core builder.

## `content-type:details`

- **Flags**: stack identity flags as above; `--content-type` (`-c`) required; `--path` / `--no-path` (`-p`) — default shows path column; use `--no-path` on narrow terminals (README).
- **Files**: `src/commands/content-type/details.ts`, `src/core/content-type/details.ts`.
- **Behavior**: Fetches CT + **references** via `ContentstackClient.getContentTypeReferences`.

## `content-type:audit`

- **Flags**: stack identity + `--content-type` (`-c`) required.
- **Files**: `src/commands/content-type/audit.ts`, `src/core/content-type/audit.ts`.
- **Behavior**: Audit logs via `getContentTypeAuditLogs`; README notes **audit log retention** (e.g. 90 days) per Contentstack docs.

## `content-type:compare`

- **Flags**: stack identity + `--content-type` (`-c`); optional `--left` (`-l`) / `--right` (`-r`) **integers** (both required if either set). If omitted, command infers latest version vs previous from discovery fetch.
- **Files**: `src/commands/content-type/compare.ts`, `src/core/content-type/compare.ts`.
- **Behavior**: Side-by-side diff in **HTML** in a browser; not stdout-only. Warns if left === right.

## `content-type:compare-remote`

- **Flags**: `--origin-stack` (`-o`) and `--remote-stack` (`-r`) **required** (stack API keys); `--content-type` (`-c`) required. No token-alias flow for two stacks—setup uses **origin** stack key for session.
- **Files**: `src/commands/content-type/compare-remote.ts`, same `core/content-type/compare.ts` as same-stack compare.
- **Behavior**: Same HTML diff pipeline; compares CT JSON from two stacks. Warns if origin === remote API key.

## `content-type:diagram`

- **Flags**: stack identity; `--output` (`-o`) **required** (full path); `--direction` (`-d`) `portrait` | `landscape` (required in schema, default portrait); `--type` (`-t`) `svg` | `dot` (default svg).
- **Files**: `src/commands/content-type/diagram.ts`, `src/core/content-type/diagram.ts`.
- **Behavior**: Loads all content types + global fields; renders graph. **Graphviz** must be installed for typical SVG generation; DOT export available. README documents `-t dot` for raw DOT language.

## Editing checklist

| Change | Touch first |
|--------|-------------|
| New flag / description | Command file under `src/commands/content-type/`, then `oclif readme` |
| Output format / table | `src/core/content-type/*.ts`, `formatting.ts` |
| REST audit/references | `src/core/contentstack/client.ts`, `error.ts` |
| SDK pagination / fetch | `src/utils/index.ts`, `src/config/index.ts` |
