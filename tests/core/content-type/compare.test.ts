jest.mock('cli-ux', () => ({
  __esModule: true,
  default: {
    open: jest.fn().mockResolvedValue(undefined),
  },
}))

jest.mock('tmp', () => ({
  file: jest.fn(
    (
      _opts: unknown,
      cb: (err: Error | null, path: string, fd: number, cleanup: () => void) => void
    ) => {
      cb(null, '/tmp/fake-compare.html', 0, jest.fn())
    }
  ),
}))

jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
}))

jest.mock('diff2html', () => ({
  parse: jest.fn(() => [{ value: 'parsed' }]),
  html: jest.fn(() => '<div class="d2h">diff-html</div>'),
}))

jest.mock('git-diff', () =>
  jest.fn(() => '@@ -1 +1 @@\n+changed')
)

import fs from 'fs'

import buildOutput from '../../../src/core/content-type/compare'

describe('compare buildOutput', () => {
  const prev = { uid: 'ct', updated_at: '2020-01-01' }
  const curr = { uid: 'ct', updated_at: '2021-01-01' }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns BuildOutput and writes HTML file with diff2html body', async () => {
    const out = await buildOutput('my-ct', prev, curr)

    expect(out.hasResults).toBe(true)
    expect(out.body).toBe('Please check the browser output.')
    expect(out.header).toBeNull()
    expect(fs.writeFileSync).toHaveBeenCalled()
    const written = (fs.writeFileSync as jest.Mock).mock.calls[0][1] as string
    expect(written).toContain('<!DOCTYPE html>')
    expect(written).toContain('diff-html')
    expect(written).toContain('diff2html')
  })
})
