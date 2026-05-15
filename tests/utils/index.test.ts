/**
 * Success-path tests for utils; error-path tests mock process.exit.
 */
import { cliux } from '@contentstack/cli-utilities'

import config from '../../src/config'
import {
  getContentType,
  getContentTypes,
  getGlobalFields,
  getStack,
  getUsers
} from '../../src/utils/index'

jest.mock('@contentstack/cli-utilities', () => ({
  cliux: {
    loaderV2: jest.fn(),
    print: jest.fn()
  }
}))

describe('utils/index', () => {
  const spinner = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  function stackFactory(overrides: {
    contentTypeFetch?: jest.Mock
    fetchData?: any
    findImpl?: jest.Mock
    globalFindImpl?: jest.Mock
    usersData?: any
  }) {
    const {
      contentTypeFetch,
      fetchData = {
        master_locale: 'en-us',
        name: 'Stack',
        org_uid: 'org-1',
        uid: 'stack-uid'
      },
      findImpl,
      globalFindImpl,
      usersData = []
    } = overrides

    const ctFind =
      findImpl ||
      jest.fn().mockResolvedValue({ count: 1, items: [{ uid: 'ct1' }] })
    const gfFind =
      globalFindImpl ||
      jest.fn().mockResolvedValue({ count: 1, items: [{ uid: 'gf1' }] })

    return {
      stack: jest.fn().mockReturnValue({
        contentType: jest.fn((uid?: string) => {
          if (uid) {
            return {
              fetch: contentTypeFetch || jest.fn().mockResolvedValue({
                _version: 7,
                title: 'CT',
                uid
              })
            }
          }
          return {
            query: () => ({
              find: ctFind
            })
          }
        }),
        fetch: jest.fn().mockResolvedValue(fetchData),
        globalField: () => ({
          query: () => ({
            find: gfFind
          })
        }),
        users: jest.fn().mockResolvedValue(usersData)
      })
    }
  }

  it('getStack should map stack fields', async () => {
    const sdk = stackFactory({})
    const stack = await getStack(sdk, 'api-key-1', spinner)
    expect(stack).toEqual({
      api_key: 'api-key-1',
      master_locale: 'en-us',
      name: 'Stack',
      org_uid: 'org-1',
      uid: 'stack-uid'
    })
    expect(sdk.stack).toHaveBeenCalledWith({ api_key: 'api-key-1' })
  })

  it('getUsers should return users array', async () => {
    const users = [{ first_name: 'A', last_name: 'B', uid: 'u1' }]
    const sdk = stackFactory({ usersData: users })
    await expect(getUsers(sdk, 'k', spinner)).resolves.toEqual(users)
  })

  it('getContentTypes should aggregate single page', async () => {
    const find = jest
      .fn()
      .mockResolvedValue({ count: 2, items: [{ uid: 'a' }, { uid: 'b' }] })
    const sdk = stackFactory({ findImpl: find })
    const items = await getContentTypes(sdk, 'k', spinner)
    expect(items).toHaveLength(2)
    expect(find).toHaveBeenCalledTimes(1)
  })

  it('getContentTypes should paginate when count exceeds skip + limit', async () => {
    const limit = config.limit
    const page1 = Array(limit)
      .fill(null)
      .map((_, i) => ({ uid: `p1-${i}` }))
    const page2 = [{ uid: 'last' }]
    const find = jest
      .fn()
      .mockResolvedValueOnce({ count: limit + 1, items: page1 })
      .mockResolvedValueOnce({ count: limit + 1, items: page2 })
    const sdk = stackFactory({ findImpl: find })
    const items = await getContentTypes(sdk, 'k', spinner)
    expect(find).toHaveBeenCalledTimes(2)
    expect(items).toHaveLength(limit + 1)
  })

  it('getGlobalFields should paginate like getContentTypes', async () => {
    const limit = config.limit
    const page1 = Array(limit)
      .fill(null)
      .map((_, i) => ({ uid: `gf-${i}` }))
    const find = jest
      .fn()
      .mockResolvedValueOnce({ count: limit + 1, items: page1 })
      .mockResolvedValueOnce({ count: limit + 1, items: [{ uid: 'x' }] })
    const sdk = stackFactory({ globalFindImpl: find })
    const items = await getGlobalFields(sdk, 'k', spinner)
    expect(find).toHaveBeenCalledTimes(2)
    expect(items).toHaveLength(limit + 1)
  })

  it('getContentType should fetch without version when ctVersion omitted', async () => {
    const fetch = jest.fn().mockResolvedValue({ title: 'T', uid: 'ct' })
    const sdk = stackFactory({ contentTypeFetch: fetch })
    const ct = await getContentType({
      apiKey: 'k',
      managementSdk: sdk,
      spinner,
      uid: 'ct-uid'
    })
    expect(ct).toEqual({ title: 'T', uid: 'ct' })
    expect(fetch).toHaveBeenCalledWith({})
  })

  it('getContentType should pass version when ctVersion set', async () => {
    const fetch = jest.fn().mockResolvedValue({ _version: 3, uid: 'ct' })
    const sdk = stackFactory({ contentTypeFetch: fetch })
    await getContentType({
      apiKey: 'k',
      ctVersion: '2',
      managementSdk: sdk,
      spinner,
      uid: 'ct-uid'
    })
    expect(fetch).toHaveBeenCalledWith({ version: '2' })
  })
})

describe('utils/index error paths', () => {
  const spinner = {}

  function exitThrows() {
    return jest
      .spyOn(process, 'exit')
      .mockImplementation((() => {
        throw new Error('process.exit')
      }) as (code?: string | number | null | undefined) => never)
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('getContentType: prints errorMessage and exits on API error', async () => {
    const exitSpy = exitThrows()
    const fetch = jest.fn().mockRejectedValue({ errorMessage: 'Bad request' })
    const sdk = {
      stack: jest.fn().mockReturnValue({
        contentType: jest.fn(() => ({
          fetch
        }))
      })
    }
    await expect(
      getContentType({
        apiKey: 'k',
        managementSdk: sdk,
        spinner,
        uid: 'u'
      })
    ).rejects.toThrow('process.exit')
    expect(cliux.print).toHaveBeenCalledWith('Error: Bad request', {
      color: 'red'
    })
    exitSpy.mockRestore()
  })

  it('getContentType: prints message when no errorMessage', async () => {
    const exitSpy = exitThrows()
    const fetch = jest.fn().mockRejectedValue({ message: 'Network down' })
    const sdk = {
      stack: jest.fn().mockReturnValue({
        contentType: jest.fn(() => ({
          fetch
        }))
      })
    }
    await expect(
      getContentType({
        apiKey: 'k',
        managementSdk: sdk,
        spinner,
        uid: 'u'
      })
    ).rejects.toThrow('process.exit')
    expect(cliux.print).toHaveBeenCalledWith('Error: Network down', {
      color: 'red'
    })
    exitSpy.mockRestore()
  })

  it('getContentType: prints fallback when error has no message', async () => {
    const exitSpy = exitThrows()
    const fetch = jest.fn().mockRejectedValue({})
    const sdk = {
      stack: jest.fn().mockReturnValue({
        contentType: jest.fn(() => ({
          fetch
        }))
      })
    }
    await expect(
      getContentType({
        apiKey: 'k',
        managementSdk: sdk,
        spinner,
        uid: 'u'
      })
    ).rejects.toThrow('process.exit')
    expect(cliux.print).toHaveBeenCalledWith(
      'Error: Something went wrong.Please try again!',
      { color: 'red' }
    )
    exitSpy.mockRestore()
  })

  it('getStack: prints errorMessage and exits on fetch failure', async () => {
    const exitSpy = exitThrows()
    const sdk = {
      stack: jest.fn().mockReturnValue({
        fetch: jest.fn().mockRejectedValue({ errorMessage: 'no stack' })
      })
    }
    await expect(
      getStack(sdk, 'k', spinner)
    ).rejects.toThrow('process.exit')
    expect(cliux.print).toHaveBeenCalledWith('Error: no stack', { color: 'red' })
    exitSpy.mockRestore()
  })

  it('getContentTypes: prints message on query failure', async () => {
    const exitSpy = exitThrows()
    const find = jest.fn().mockRejectedValue({ message: 'query failed' })
    const sdk = {
      stack: jest.fn().mockReturnValue({
        contentType: jest.fn(() => ({
          query: () => ({ find })
        }))
      })
    }
    await expect(getContentTypes(sdk, 'k', spinner)).rejects.toThrow(
      'process.exit'
    )
    expect(cliux.print).toHaveBeenCalledWith('Error: query failed', {
      color: 'red'
    })
    exitSpy.mockRestore()
  })
})
