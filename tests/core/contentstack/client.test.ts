import axios from 'axios'

import ContentstackClient from '../../../src/core/contentstack/client'
import ContentstackError from '../../../src/core/contentstack/error'

jest.mock('axios')
jest.mock('@contentstack/cli-utilities', () => ({
  cliux: {
    loaderV2: jest.fn()
  }
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('ContentstackClient', () => {
  const mockGet = jest.fn()
  const spinner = {}

  beforeEach(() => {
    jest.clearAllMocks()
    mockGet.mockResolvedValue({ data: { ok: true } })
    mockedAxios.create.mockReturnValue({
      get: mockGet
    } as any)
  })

  describe('getContentTypeAuditLogs', () => {
    it('should call GET /audit-logs with query and api_key header', async () => {
      const client = new ContentstackClient('api.contentstack.io', 'token123')
      await client.getContentTypeAuditLogs('stack-key', 'ct-uid', spinner)

      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.contentstack.io/v3/',
        headers: { authtoken: 'token123' }
      })
      expect(mockGet).toHaveBeenCalledWith(
        '/audit-logs',
        expect.objectContaining({
          headers: { api_key: 'stack-key' },
          params: {
            query: {
              $and: [
                { module: 'content_type' },
                { 'metadata.uid': 'ct-uid' }
              ]
            }
          }
        })
      )
    })

    it('should use authorization header when token includes Bearer', async () => {
      new ContentstackClient('host', 'Bearer xyz')
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://host/v3/',
        headers: { authorization: 'Bearer xyz' }
      })
    })

    it('should return response data', async () => {
      mockGet.mockResolvedValueOnce({ data: { logs: [{ id: 1 }] } })
      const client = new ContentstackClient('h', 't')
      await expect(
        client.getContentTypeAuditLogs('k', 'u', spinner)
      ).resolves.toEqual({ logs: [{ id: 1 }] })
    })

    it('should throw ContentstackError when API returns structured error', async () => {
      mockGet.mockRejectedValueOnce({
        response: {
          data: {
            error_code: 401,
            error_message: 'Bad key',
            errors: { api_key: ['invalid'] }
          }
        }
      })
      const client = new ContentstackClient('h', 't')
      const err = await client
        .getContentTypeAuditLogs('my-key', 'u', spinner)
        .then(
          () => {
            throw new Error('expected rejection')
          },
          (e) => e
        )
      expect(err).toBeInstanceOf(ContentstackError)
      expect((err as ContentstackError).message).toContain(
        "Stack API Key 'my-key'"
      )
      expect((err as ContentstackError).status).toBe(401)
    })

    it('should throw generic Error when response shape is unrecognized', async () => {
      mockGet.mockRejectedValueOnce({ response: {} })
      const client = new ContentstackClient('h', 't')
      await expect(
        client.getContentTypeAuditLogs('k', 'u', spinner)
      ).rejects.toThrow('Unrecognized error')
    })
  })

  describe('getContentTypeReferences', () => {
    it('should call GET content_types uid references with params', async () => {
      const client = new ContentstackClient('api.contentstack.io', 'token123')
      await client.getContentTypeReferences('stack-key', 'ct-uid', spinner)

      expect(mockGet).toHaveBeenCalledWith('/content_types/ct-uid/references', {
        headers: { api_key: 'stack-key' },
        params: { include_global_fields: true }
      })
    })

    it('should return response data', async () => {
      mockGet.mockResolvedValueOnce({ data: { references: [] } })
      const client = new ContentstackClient('h', 't')
      await expect(
        client.getContentTypeReferences('k', 'uid-1', spinner)
      ).resolves.toEqual({ references: [] })
    })

    it('should throw when API returns errors for references', async () => {
      mockGet.mockRejectedValueOnce({
        response: {
          data: {
            error_code: 404,
            error_message: 'Missing',
            errors: {}
          }
        }
      })
      const client = new ContentstackClient('h', 't')
      await expect(
        client.getContentTypeReferences('k', 'uid-1', spinner)
      ).rejects.toThrow()
    })
  })
})
