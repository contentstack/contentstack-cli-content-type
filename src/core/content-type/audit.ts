import {table} from 'table'
import {BuildOutput} from '../../types'
import * as format from './formatting'

export default function buildOutput(logs: any, users: any): BuildOutput {
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
    header: null,
    body: table(rows),
    footer: null,
    rows: rows,
    hasResults: rows.length > 1,
  }
}
