import axios, {AxiosInstance} from 'axios'
import ContentstackError from './error'
import {cliux} from "@contentstack/cli-utilities"

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

  async getContentTypeAuditLogs(api_key: string, uid: string, spinner: any): Promise<any> {
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
      cliux.loaderV2('', spinner)
      throw this.buildError(error, {api_key})
    }
  }

  async getContentTypeReferences(api_key: string, uid: string, spinner: any): Promise<any> {
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
      cliux.loaderV2('', spinner)
      throw this.buildError(error, {api_key})
    }
  }

  private buildError(error: any, context: any = {}) {
    const data = error?.response?.data
    if (!data || !data.errors) return new Error('Unrecognized error. Please try again.')

    let message = data.error_message
    const code = data.error_code

    if (data.errors.api_key && context.api_key) {
      message += ` This is in regards to the Stack API Key '${context.api_key}'.`
    }
    return new ContentstackError(message, code)
  }
}
