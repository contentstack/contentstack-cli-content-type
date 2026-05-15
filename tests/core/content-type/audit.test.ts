import buildOutput from '../../../src/core/content-type/audit'
import * as format from '../../../src/core/content-type/formatting'

describe('audit buildOutput', () => {
  const users = [
    { first_name: 'Jane', last_name: 'Doe', uid: 'u1' }
  ]

  it('should have no results when logs is empty', () => {
    const out = buildOutput([], users)
    expect(out.hasResults).toBe(false)
    expect(out.rows).toHaveLength(1)
    expect(out.rows[0]).toEqual(['Event', 'User', 'Modified', 'Version'])
    expect(out.footer).toBeNull()
    expect(out.body).toContain('Event')
  })

  it('should map one log row and set hasResults', () => {
    const createdAt = '2024-01-10T10:00:00.000Z'
    const logs = [
      {
        created_at: createdAt,
        created_by: 'u1',
        event_type: 'update',
        metadata: { version: 3 }
      }
    ]
    const out = buildOutput(logs, users)
    expect(out.hasResults).toBe(true)
    expect(out.rows).toHaveLength(2)
    expect(out.rows[1][0]).toBe('update')
    expect(out.rows[1][1]).toBe('Jane Doe')
    expect(out.rows[1][2]).toBe(format.date(createdAt))
    expect(out.rows[1][3]).toBe(3)
    expect(out.body).toContain('update')
    expect(out.body).toContain('Jane Doe')
  })
})
