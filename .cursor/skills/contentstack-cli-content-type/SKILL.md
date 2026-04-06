---
name: contentstack-cli-content-type
description: >-
  Develops and maintains the contentstack-cli-content-type csdx plugin (content-type list,
  details, audit, compare, compare-remote, diagram). Use when editing this repository,
  ContentTypeCommand setup and flags, CMA/Management SDK usage, axios audit/references calls,
  diff/compare HTML output, Graphviz diagrams, or oclif readme/manifest workflows.
---

# contentstack-cli-content-type

## Repository role

npm package `contentstack-cli-content-type`: a **Contentstack CLI** (`csdx`) plugin that reads Content Type metadata from a stack—list, field details, audit log lines, version or cross-stack comparison, and stack content-model diagrams.

## Code layout

| Area | Path |
|------|------|
| Command classes (oclif) | `src/commands/content-type/*.ts` |
| Shared base | `src/core/command.ts` — `ContentTypeCommand` extends `@contentstack/cli-command` `Command` |
| Core output / logic | `src/core/content-type/*.ts` |
| HTTP client (axios CMA) | `src/core/contentstack/client.ts`, `src/core/contentstack/error.ts` |
| Stack / CT fetch helpers | `src/utils/index.ts` (uses Management SDK from `@contentstack/cli-utilities`) |
| Types | `src/types/index.ts` |
| Config (pagination limits) | `src/config/index.ts` |

Commands **parse flags**, call **`setup(flags)`** (see below), build **`managementSDKClient`**, then call utils + core builders. See [references/architecture.md](references/architecture.md) and [references/commands.md](references/commands.md).

## Authentication and stack identity

1. `authenticationHandler.getAuthDetails()`; must have **access token** or command exits with `auth:login` message (`exit: 2`).
2. User must pass **either** a **management token alias** (`-a` / `--alias` or `--token-alias`) **or** **stack API key** (`-k` / `--stack-api-key`) or deprecated `--stack` (maps to stack key). If neither: error and `process.exit(1)` (message references “token alias or stack UID”).
3. Token alias: `getToken(alias)` → `apiKey` from token; warns if token type is not `management`.
4. `ContentTypeCommand` constructs **`ContentstackClient(this.cmaHost, authToken)`** for REST calls that use `api_key` in headers.

**Do not log** tokens, `authorization` / `authtoken` headers, or full CLI credentials.

## Two ways to call APIs

- **Axios `ContentstackClient`**: `GET https://{cmaHost}/v3/...` with default headers `authorization` (if Bearer) or `authtoken`, plus per-request `headers: { api_key }`. Used for audit logs and references. Errors → `ContentstackError` via `buildError`.
- **Management SDK** (`managementSDKClient({ host, 'X-CS-CLI': ... })`): stack fetch, content types, global fields, content type by version—see `src/utils/index.ts`.

## Build and CLI metadata

From `package.json`:

- **`prepack`**: `rm -rf lib && tsc -b && oclif manifest && oclif readme` — publishable `lib/`, manifest, and README command docs.
- **`version`**: `oclif readme && git add README.md`.

After changing commands, flags, or descriptions, run the appropriate script so **README** and **oclif.manifest.json** stay in sync.

## Short command names (csdx)

`package.json` → `csdxConfig.shortCommandName`:

| Command id | Short name |
|------------|------------|
| `content-type:audit` | CTAUDIT |
| `content-type:compare` | CTCMP |
| `content-type:compare-remote` | CTCMP-R |
| `content-type:details` | CTDET |
| `content-type:diagram` | CTDIAG |
| `content-type:list` | CTLS |

## Further reading

- [references/architecture.md](references/architecture.md) — command → core mapping, auth flow, CMA shape.
- [references/commands.md](references/commands.md) — flags, UX notes, files to edit per command.
