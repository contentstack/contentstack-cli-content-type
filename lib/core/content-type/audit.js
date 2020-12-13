"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const tableImport = tslib_1.__importStar(require("table"));
const format = tslib_1.__importStar(require("./formatting"));
const { table } = tableImport;
function buildOutput(logs, users) {
    const rows = [];
    rows.push(['Event', 'User', 'Modified', 'Version']);
    for (const log of logs) {
        rows.push([
            log.event_type,
            format.fullName(users, log.created_by),
            format.date(log.created_at),
            log.metadata.version,
        ]);
    }
    return {
        body: table(rows),
        hasRows: rows.length > 1,
    };
}
exports.default = buildOutput;
