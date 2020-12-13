import axios, {AxiosInstance} from 'axios'
import ContentstackError from './error'

export interface Stack {
  uid: string;
  name: string;
  master_locale: string;
  api_key: string;
  org_uid: string;
}

export default class ContentstackClient {
  private instance: AxiosInstance;

  constructor(cmaHost: string, authToken: string) {
    this.instance = axios.create({
      baseURL: `https://${cmaHost}/v3/`,
      headers: {
        authtoken: authToken,
      },
    })
  }

  async getStack(api_key: string): Promise<Stack> {
    try {
      const response = await this.instance.get('/stacks', {
        headers: {
          api_key,
        },
      })

      const stack = response.data.stack

      return {
        api_key,
        master_locale: stack.master_locale,
        name: stack.name,
        org_uid: stack.org_uid,
        uid: stack.uid,
      } as Stack
    } catch (error) {
      throw this.buildError(error)
    }
  }

  async getUsers(api_key: string): Promise<any> {
    try {
      const response = await this.instance.get('/stacks', {
        params: {
          include_collaborators: true,
        },
        headers: {api_key},
      })

      return response.data.stack.collaborators
    } catch (error) {
      throw this.buildError(error)
    }
  }

  async getContentTypeAuditLogs(api_key: string, uid: string): Promise<any> {
    try {
      const response = await this.instance.get('/audit-logs',
        {
          params: {
            query: {$and: [{module: 'content_type'}, {'metadata.uid': uid}]},
          },
          headers: {api_key},
        })

      return response.data
    } catch (error) {
      throw this.buildError(error)
    }
  }

  async getContentTypeReferences(api_key: string, uid: string): Promise<any> {
    try {
      const response = await this.instance.get(`/content_types/${uid}/references`, {
        params: {
          include_global_fields: true,
        },
        headers: {
          api_key,
        },
      })

      return response.data
    } catch (error) {
      throw this.buildError(error)
    }
  }

  async getContentType(api_key: string, uid: string, includeGlobalFields = false, version?: number): Promise<any> {
    try {
      const response = await this.instance.get(`/content_types/${uid}`, {
        params: {
          version: version,
          include_global_field_schema: includeGlobalFields,
        },
        headers: {
          api_key,
        },
      })

      return response.data
    } catch (error) {
      throw this.buildError(error)
    }
  }

  async getContentTypes(api_key: string, includeGlobalFields = false): Promise<any> {
    try {
      const response = await this.instance.get('/content_types', {
        params: {
          api_key: api_key,
          include_count: true,
          include_global_field_schema: includeGlobalFields,
        },
      })

      return response.data
    } catch (error) {
      throw this.buildError(error)
    }
  }

  private buildError(error: any) {
    const data = error?.response?.data
    if (!data) return new Error('Unrecognized error. Please try again.')
    return new ContentstackError(data.error_message, data.error_code)
  }
}
