"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tableImport = tslib_1.__importStar(require("table"));
const format = tslib_1.__importStar(require("./formatting"));
const { table } = tableImport;
function buildOutput(contentTypes, order) {
    const all = contentTypes.content_types;
    const count = contentTypes.count;
    const rows = [];
    rows.push(['Title', 'UID', 'Modified', 'Version']);
    all.sort((left, right) => {
        if (order === 'modified') {
            return sortByDate(left.updated_at, right.updated_at);
        }
        return sortByString(left.title, right.title);
    });
    for (const ct of all) {
        rows.push([ct.title, ct.uid, format.date(ct.updated_at), ct._version]);
    }
    return {
        body: table(rows),
        footer: `Count: ${count}`,
        hasRows: rows.length > 1,
    };
}
exports.default = buildOutput;
function sortByString(left, right) {
    return left.localeCompare(right);
}
function sortByDate(left, right) {
    // @ts-ignore
    return new Date(right) - new Date(left);
}
