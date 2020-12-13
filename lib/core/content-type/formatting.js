"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checked = exports.urlPattern = exports.allowMultiple = exports.contentType = exports.fullName = exports.date = void 0;
const tslib_1 = require("tslib");
const moment_1 = tslib_1.__importDefault(require("moment"));
const urljoin = require('url-join');
const TIME_FORMAT = 'L hh:mm:ss a';
function date(date) {
    return moment_1.default(date).format(TIME_FORMAT);
}
exports.date = date;
function fullName(users, uid) {
    if (!users || users.length == 0)
        return 'Unknown';
    const user = users.find((u) => u.uid == uid);
    if (!user)
        return 'Unknown';
    return `${user.first_name} ${user.last_name}`;
}
exports.fullName = fullName;
function contentType(contentType) {
    if (!contentType || !contentType.options)
        return 'Unknown';
    if (contentType.options.is_page) {
        return 'Page';
    }
    return 'Content Block';
}
exports.contentType = contentType;
function allowMultiple(contentType) {
    if (!contentType || !contentType.options)
        return 'Unknown';
    return contentType.options.singleton ? 'False' : 'True';
}
exports.allowMultiple = allowMultiple;
function urlPattern(contentType) {
    if (!contentType || !contentType.options)
        return 'Unknown';
    if (!contentType.options.url_pattern)
        return 'N/A';
    return urljoin(contentType.options.url_prefix, contentType.options.url_pattern);
}
exports.urlPattern = urlPattern;
function checked(value) {
    if (value)
        return '*';
}
exports.checked = checked;
