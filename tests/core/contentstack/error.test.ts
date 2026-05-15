import ContentstackError from '../../../src/core/contentstack/error'

describe('ContentstackError', () => {
  it('should set message, status, and name', () => {
    const err = new ContentstackError('not found', 404)
    expect(err.message).toBe('not found')
    expect(err.status).toBe(404)
    expect(err.name).toBe('ContentstackError')
  })

  it('should be instanceof Error', () => {
    const err = new ContentstackError('x', 500)
    expect(err).toBeInstanceOf(Error)
    expect(err).toBeInstanceOf(ContentstackError)
  })
})
