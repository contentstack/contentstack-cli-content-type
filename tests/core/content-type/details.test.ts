import buildOutput from '../../../src/core/content-type/details'

describe('details buildOutput', () => {
  const baseCt = {
    _version: 1,
    created_at: '2020-01-01T00:00:00.000Z',
    description: 'Desc',
    options: { is_page: false, singleton: false },
    schema: [] as any[],
    title: 'My CT',
    uid: 'ct1',
    updated_at: '2021-01-01T00:00:00.000Z',
  }

  it('builds header with description and references', () => {
    const out = buildOutput(
      baseCt,
      { references: ['ref-a', 'ref-b'] },
      { showPath: true }
    )
    expect(out.hasResults).toBe(false)
    expect(out.header).toContain('Description: Desc')
    expect(out.header).toContain('Referenced By: ref-a, ref-b')
    expect(out.footer).toBeNull()
  })

  it('uses None when no description and no references', () => {
    const out = buildOutput(
      { ...baseCt, description: undefined },
      { references: [] },
      { showPath: true }
    )
    expect(out.header).toContain('Description: None')
    expect(out.header).toContain('Referenced By: None')
  })

  it('renders flat schema with R/M/U column', () => {
    const ct = {
      ...baseCt,
      schema: [
        {
          data_type: 'text',
          display_name: 'Title',
          mandatory: true,
          multiple: false,
          uid: 'title',
          unique: true,
        },
      ],
    }
    const out = buildOutput(ct, { references: [] }, { showPath: true })
    expect(out.hasResults).toBe(true)
    expect(out.body).toContain('Title')
    expect(out.body).toContain('text')
    expect(out.body).toContain('title')
    expect(out.body).toContain('RU')
  })

  it('nested schema adds parent prefix in display name', () => {
    const ct = {
      ...baseCt,
      schema: [
        {
          data_type: 'group',
          display_name: 'Group',
          schema: [
            {
              data_type: 'text',
              display_name: 'Child',
              mandatory: false,
              multiple: true,
              uid: 'child',
              unique: false,
            },
          ],
          uid: 'grp',
        },
      ],
    }
    const out = buildOutput(ct, { references: [] }, { showPath: true })
    expect(out.body).toContain('[grp] Child')
    expect(out.body).toContain('grp.child')
    expect(out.body).toContain('M')
  })

  it('processes blocks with nested schema', () => {
    const ct = {
      ...baseCt,
      schema: [
        {
          blocks: [
            {
              schema: [
                {
                  data_type: 'number',
                  display_name: 'Num',
                  mandatory: false,
                  multiple: false,
                  uid: 'num',
                  unique: false,
                },
              ],
              title: 'BlockTitle',
              uid: 'blk',
            },
          ],
          data_type: 'blocks',
          display_name: 'Modular',
          uid: 'mod',
        },
      ],
    }
    const out = buildOutput(ct, { references: [] }, { showPath: true })
    expect(out.body).toContain('[BlockTitle] Num')
    expect(out.body).toContain('number')
  })

  it('hides path column when showPath false', () => {
    const ct = {
      ...baseCt,
      schema: [
        {
          data_type: 'text',
          display_name: 'T',
          mandatory: false,
          multiple: false,
          uid: 'u',
          unique: false,
        },
      ],
    }
    const out = buildOutput(ct, { references: [] }, { showPath: false })
    expect(out.body).not.toContain('Path')
    expect(out.body).not.toContain('ct1.u')
  })
})
