"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const error_1 = tslib_1.__importDefault(require("./error"));
class ContentstackClient {
    constructor(cmaHost, authToken) {
        this.instance = axios_1.default.create({
            baseURL: `https://${cmaHost}/v3/`,
            headers: {
                authtoken: authToken,
            },
        });
    }
    async getStack(api_key) {
        try {
            const response = await this.instance.get('/stacks', {
                headers: {
                    api_key,
                },
            });
            const stack = response.data.stack;
            return {
                api_key,
                master_locale: stack.master_locale,
                name: stack.name,
                org_uid: stack.org_uid,
                uid: stack.uid,
            };
        }
        catch (error) {
            const data = error.response.data;
            throw new error_1.default(data.error_message, data.error_code);
        }
    }
    async getUsers(api_key) {
        const response = await this.instance.get('/stacks', {
            params: {
                include_collaborators: true,
            },
            headers: { api_key },
        });
        return response.data.stack.collaborators;
    }
    async getContentTypeAuditLogs(api_key, uid) {
        const response = await this.instance.get('/audit-logs', {
            params: {
                query: { $and: [{ module: 'content_type' }, { 'metadata.uid': uid }] },
            },
            headers: { api_key },
        });
        return response.data;
    }
    async getContentTypeReferences(api_key, uid) {
        try {
            const response = await this.instance.get(`/content_types/${uid}/references`, {
                params: {
                    include_global_fields: true,
                },
                headers: {
                    api_key,
                },
            });
            return response.data;
        }
        catch (error) {
            const data = error.response.data;
            throw new error_1.default(data.error_message, data.error_code);
        }
    }
    async getContentType(api_key, uid, includeGlobalFields = false, version) {
        try {
            const response = await this.instance.get(`/content_types/${uid}`, {
                params: {
                    version: version,
                    include_global_field_schema: includeGlobalFields,
                },
                headers: {
                    api_key,
                },
            });
            return response.data;
        }
        catch (error) {
            const data = error.response.data;
            throw new error_1.default(data.error_message, data.error_code);
        }
    }
    async getContentTypes(api_key, includeGlobalFields = false) {
        const response = await this.instance.get('/content_types', {
            params: {
                api_key: api_key,
                include_count: true,
                include_global_field_schema: includeGlobalFields,
            },
        });
        return response.data;
    }
}
exports.default = ContentstackClient;
