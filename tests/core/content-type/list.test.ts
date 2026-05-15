import * as format from '../../../src/core/content-type/formatting'
import buildOutput from '../../../src/core/content-type/list'

describe('list buildOutput', () => {
  const cts = [
    {
      _version: 1,
      title: 'Zebra',
      uid: 'z',
      updated_at: '2020-01-01T00:00:00.000Z'
    },
    {
      _version: 2,
      title: 'Alpha',
      uid: 'a',
      updated_at: '2024-06-01T00:00:00.000Z'
    },
    {
      _version: 3,
      title: 'Mike',
      uid: 'm',
      updated_at: '2022-01-01T00:00:00.000Z'
    }
  ]

  it('should sort by title ascending', () => {
    const out = buildOutput(cts, 'title')
    expect(out.hasResults).toBe(true)
    expect(out.footer).toBe('Count: 3')
    const dataRows = out.rows.slice(1)
    expect(dataRows.map((r) => r[0])).toEqual(['Alpha', 'Mike', 'Zebra'])
  })

  it('should sort by modified descending (newest first)', () => {
    const out = buildOutput(cts, 'modified')
    const dataRows = out.rows.slice(1)
    expect(dataRows.map((r) => r[0])).toEqual(['Alpha', 'Mike', 'Zebra'])
    expect(dataRows[0][2]).toBe(
      format.date('2024-06-01T00:00:00.000Z')
    )
  })

  it('should report zero count when empty', () => {
    const out = buildOutput([], 'title')
    expect(out.hasResults).toBe(false)
    expect(out.footer).toBe('Count: 0')
    expect(out.rows).toHaveLength(1)
  })
})
