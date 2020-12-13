export default class ContentstackError extends Error {
    status: number;
    constructor(message: string, status: number);
}
