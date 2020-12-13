import * as tableImport from 'table'
import * as format from './formatting'

const {table} = tableImport

export default function buildOutput(contentType: any, references: any) {
  const header = buildHeader(contentType.content_type, references.references)
  const body = buildBody(contentType.content_type.schema)

  return {
    header: header,
    body: body.body,
    hasRows: body.hasRows,
  }
}

function buildBody(schema: any) {
  const rows = []

  rows.push(['Display Name', 'UID', 'Data Type', 'Path', 'Required', 'Multiple', 'Unique'])
  rows.push(...processFields(schema))

  return {
    hasRows: rows.length > 1,
    body: table(rows),
  }
}

function processFields(schema: any, parent = null, depth = 0, prefix = ''): any {
  const rows = []

  for (const field of schema) {
    rows.push(buildRow(field, parent, depth, prefix))

    if (field.schema) {
      rows.push(...processFields(field.schema, field.uid, depth + 1, (prefix ? prefix + '.' : '') + field.uid))
    }

    if (field.blocks) {
      for (const block of field.blocks) {
        if (block.schema) {
          rows.push(...processFields(block.schema, block.title, depth + 1, field.uid + '.' + prefix + block.uid))
        }
      }
    }
  }

  return rows
}

function buildRow(field: any, parent = null, depth = 0, prefix = '') {
  const dots = '.'.repeat(depth === 0 ? 0 : depth * 2)
  const displayName = `${prefix ? dots : ''}${parent ? '[' + parent + '] ' : ''}${field.display_name}`
  const path = `${prefix ? prefix + '.' : ''}${field.uid}`

  return [
    displayName,
    field.uid,
    field.data_type,
    path,
    format.checked(field.mandatory),
    format.checked(field.multiple),
    format.checked(field.unique),
  ]
}

function buildHeader(contentType: any, references: string[]) {
  const result = []
  const details = []

  result.push(`Description: ${contentType.description ? contentType.description : 'None'}`)
  result.push(`Referenced By: ${references.length > 0 ? references.join(', ') : 'None'}\n`)

  details.push(['Type', 'Multiple', 'URL Pattern', 'Created', 'Modified', 'Version'])

  details.push([
    format.contentType(contentType),
    format.allowMultiple(contentType),
    format.urlPattern(contentType),
    format.date(contentType.created_at),
    format.date(contentType.updated_at),
    contentType._version,
  ])

  result.push(table(details))

  return result.join('\n')
}
