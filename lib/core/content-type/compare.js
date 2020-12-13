"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cli_ux_1 = tslib_1.__importDefault(require("cli-ux"));
const Diff2html = require('diff2html');
const gitDiff = require('git-diff');
const tmp = require('tmp');
const fs = require('fs');
async function buildOutput(contentTypeName, previous, current) {
    const diffString = buildDiffString(previous, current);
    const diffTree = Diff2html.parse(diffString);
    const diffHtml = Diff2html.html(diffTree, {
        outputFormat: 'side-by-side',
        drawFileList: false,
        matching: 'lines',
    });
    await tmp.file({ prefix: `${contentTypeName}-compare`, postfix: '.html', keep: true }, async function (err, path, fd, cleanupCallback) {
        if (err)
            throw err;
        fs.writeFileSync(path, html(diffHtml));
        await cli_ux_1.default.open(path);
    });
}
exports.default = buildOutput;
function buildDiffString(previous, current) {
    return (`--- ${previous.content_type.uid}\t${current.content_type.updated_at}\n` +
        `+++ ${current.content_type.uid}\t${current.content_type.updated_at}\n` +
        gitDiff(JSON.stringify(previous, null, 2), JSON.stringify(current, null, 2)));
}
function html(body) {
    return `
  <!DOCTYPE html>
  <html>
      <head>
          <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css" />
          <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/diff2html/bundles/js/diff2html.min.js"></script>
      </head>
      <body>
       ${body}
      </body>
  </html>`;
}
