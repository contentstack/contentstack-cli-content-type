# Jest mocking (this repo)

## Principles

1. **No live API calls** — Do not hit Contentstack Management API or real stacks in unit tests.
2. **Mock at the boundary** — Prefer mocking `ContentstackClient` methods, axios, or `@contentstack/cli-utilities` pieces (e.g. `managementSDKClient`, `authenticationHandler`) when testing command flows.
3. **Coverage** — Follow global thresholds in [jest.config.js](../../../jest.config.js) and the summary in [AGENTS.md](../../../AGENTS.md).

## Mocking ContentstackClient

Example pattern: spy or replace methods that perform HTTP:

```typescript
import ContentstackClient from '../src/core/contentstack/client'

jest.mock('../src/core/contentstack/client', () => {
  return jest.fn().mockImplementation(() => ({
    getContentTypeAuditLogs: jest.fn().mockResolvedValue({ logs: [] }),
    getContentTypeReferences: jest.fn().mockResolvedValue({}),
  }))
})
```

Adjust import paths to match the file under test. For tests that import the class from the same path as production, use `jest.mock` with the factory before importing the subject.

## Mocking axios

If testing code that constructs axios directly, use `jest.mock('axios')` and mock `axios.create` to return an instance whose `get`/`post` resolve with fixture data. Align with [src/core/contentstack/client.ts](../../../src/core/contentstack/client.ts).

## Management SDK helpers

[src/utils/index.ts](../../../src/utils/index.ts) uses the stack SDK from `managementSDKClient`. In integration-style tests, pass a **fake** `managementSdk` object with `stack().contentType()...` chains that return Promises with fixture data instead of calling real APIs.

## Style

- Use `describe` / `it` or `test` with clear names: what behavior, under what condition.
- Keep tests **deterministic** — no real network, no reliance on local `csdx` auth state unless explicitly using an e2e harness (not assumed here).
