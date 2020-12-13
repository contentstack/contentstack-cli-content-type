import * as tableImport from 'table'
import * as format from './formatting'

const {table} = tableImport

export default function buildOutput(logs: any, users: any) {
  const rows = []

  rows.push(['Event', 'User', 'Modified', 'Version'])

  for (const log of logs) {
    rows.push([
      log.event_type,
      format.fullName(users, log.created_by),
      format.date(log.created_at),
      log.metadata.version,
    ])
  }

  return {
    body: table(rows),
    hasRows: rows.length > 1,
  }
}
