import {table} from 'table'
import {BuildOutput} from '../../types'
import * as format from './formatting'

export default function buildOutput(contentTypes: any, order: string): BuildOutput {
  const all = contentTypes 
  const rows = []

  rows.push(['Title', 'UID', 'Modified', 'Version'])

  all.sort((left: any, right: any) => {
    if (order === 'modified') {
      return sortByDate(left.updated_at, right.updated_at)
    }
    return sortByString(left.title, right.title)
  })

  for (const ct of all) {
    rows.push([ct.title, ct.uid, format.date(ct.updated_at), ct._version])
  }

  return {
    header: null,
    body: table(rows),
    footer: `Count: ${contentTypes.length}`,
    rows: rows,
    hasResults: rows.length > 1,
  }
}

function sortByString(left: string, right: string) {
  return left.localeCompare(right)
}

function sortByDate(left: string, right: string) {
  // @ts-ignore
  return new Date(right) - new Date(left)
}
