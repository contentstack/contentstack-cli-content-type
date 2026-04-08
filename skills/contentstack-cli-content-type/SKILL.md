---
name: contentstack-cli-content-type
description: >-
  Develops and maintains the contentstack-cli-content-type csdx plugin (content-type list,
  details, audit, compare, compare-remote, diagram). Use when editing this repository,
  ContentTypeCommand setup and flags, CMA/Management SDK usage, axios audit/references calls,
  diff/compare HTML output, Graphviz diagrams, or oclif readme/manifest workflows.
---

# Content Type CLI plugin – contentstack-cli-content-type

## When to use

- Editing commands under `src/commands/content-type/`, `ContentTypeCommand`, or `src/core/command.ts`.
- Changing CMA REST usage (`ContentstackClient`), Management SDK calls in `src/utils/index.ts`, or error handling in `src/core/contentstack/`.
- Working on compare/diagram HTML or Graphviz output, or regenerating CLI docs after command changes (see also [dev-workflow/SKILL.md](../dev-workflow/SKILL.md) for exact scripts).

## Instructions

### Repository role

npm package `contentstack-cli-content-type`: a **Contentstack CLI** (`csdx`) plugin that reads Content Type metadata from a stack—list, field details, audit log lines, version or cross-stack comparison, and stack content-model diagrams.

### Code layout

| Area | Path |
|------|------|
| Command classes (oclif) | `src/commands/content-type/*.ts` |
| Shared base | `src/core/command.ts` — `ContentTypeCommand` extends `@contentstack/cli-command` `Command` |
| Core output / logic | `src/core/content-type/*.ts` |
| HTTP client (axios CMA) | `src/core/contentstack/client.ts`, `src/core/contentstack/error.ts` |
| Stack / CT fetch helpers | `src/utils/index.ts` (uses Management SDK from `@contentstack/cli-utilities`) |
| Types | `src/types/index.ts` |
| Config (pagination limits) | `src/config/index.ts` |

Commands **parse flags**, call **`setup(flags)`**, build **`managementSDKClient`**, then call utils + core builders. See [references/architecture.md](references/architecture.md) and [references/commands.md](references/commands.md).

### Authentication and stack identity

1. `authenticationHandler.getAuthDetails()`; must have **access token** or command exits with `auth:login` message (`exit: 2`).
2. User must pass **either** a **management token alias** (`-a` / `--alias` or `--token-alias`) **or** **stack API key** (`-k` / `--stack-api-key`) or deprecated `--stack` (maps to stack key). If neither: error and `process.exit(1)` (message references “token alias or stack UID”).
3. Token alias: `getToken(alias)` → `apiKey` from token; warns if token type is not `management`.
4. `ContentTypeCommand` constructs **`ContentstackClient(this.cmaHost, authToken)`** for REST calls that use `api_key` in headers.

**Do not log** tokens, `authorization` / `authtoken` headers, or full CLI credentials.

### Two ways to call APIs

- **Axios `ContentstackClient`**: `GET https://{cmaHost}/v3/...` with default headers `authorization` (if Bearer) or `authtoken`, plus per-request `headers: { api_key }`. Used for audit logs and references. Errors → `ContentstackError` via `buildError`.
- **Management SDK** (`managementSDKClient({ host, 'X-CS-CLI': ... })`): stack fetch, content types, global fields, content type by version—see `src/utils/index.ts`.

### Build and CLI metadata

`package.json` scripts **`prepack`** and **`version`** drive `tsc`, `oclif manifest`, and `oclif readme`. After changing commands, flags, or descriptions, keep **README.md** and **oclif.manifest.json** in sync—see [dev-workflow/SKILL.md](../dev-workflow/SKILL.md) for commands and workflow.

### Short command names (csdx)

`package.json` → `csdxConfig.shortCommandName`:

| Command id | Short name |
|------------|------------|
| `content-type:audit` | CTAUDIT |
| `content-type:compare` | CTCMP |
| `content-type:compare-remote` | CTCMP-R |
| `content-type:details` | CTDET |
| `content-type:diagram` | CTDIAG |
| `content-type:list` | CTLS |

## References

- [references/architecture.md](references/architecture.md) — command → core mapping, auth flow, CMA shape.
- [references/commands.md](references/commands.md) — flags, UX notes, files to edit per command.
- [dev-workflow/SKILL.md](../dev-workflow/SKILL.md) — TypeScript build, ESLint, oclif docs, `npm run prepack`.
- [testing/SKILL.md](../testing/SKILL.md) — Jest layout, mocks, coverage.
- [Content Management API](https://www.contentstack.com/docs/developers/apis/content-management-api/) (external).
