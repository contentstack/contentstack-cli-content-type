export interface Organization {
    uid: string;
    name: string;
    enabled: boolean;
}
export interface Stack {
    uid: string;
    name: string;
    master_locale: string;
    api_key: string;
    org_uid: string;
}
export default class ContentstackClient {
    private instance;
    constructor(cmaHost: string, authToken: string);
    getStack(api_key: string): Promise<Stack>;
    getUsers(api_key: string): Promise<any>;
    getContentTypeAuditLogs(api_key: string, uid: string): Promise<any>;
    getContentTypeReferences(api_key: string, uid: string): Promise<any>;
    getContentType(api_key: string, uid: string, includeGlobalFields?: boolean, version?: number): Promise<any>;
    getContentTypes(api_key: string, includeGlobalFields?: boolean): Promise<any>;
}
