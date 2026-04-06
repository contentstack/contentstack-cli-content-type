import * as format from '../../../src/core/content-type/formatting'

describe('formatting', () => {
  describe('date', () => {
    it('should format a fixed ISO timestamp consistently', () => {
      const iso = '2024-06-15T14:30:00.000Z'
      const out = format.date(iso)
      expect(typeof out).toBe('string')
      expect(out.length).toBeGreaterThan(4)
    })
  })

  describe('fullName', () => {
    it('should return Unknown when users is missing or empty', () => {
      expect(format.fullName(undefined, 'u1')).toBe('Unknown')
      expect(format.fullName([], 'u1')).toBe('Unknown')
    })

    it('should return Unknown when uid is not found', () => {
      const users = [{ first_name: 'A', last_name: 'One', uid: 'a' }]
      expect(format.fullName(users, 'missing')).toBe('Unknown')
    })

    it('should return first and last name when uid matches', () => {
      const users = [
        { first_name: 'Ann', last_name: 'Alpha', uid: 'a' },
        { first_name: 'Bob', last_name: 'Beta', uid: 'b' }
      ]
      expect(format.fullName(users, 'b')).toBe('Bob Beta')
    })
  })

  describe('contentType', () => {
    it('should return Unknown when contentType or options is missing', () => {
      expect(format.contentType(undefined)).toBe('Unknown')
      expect(format.contentType({})).toBe('Unknown')
    })

    it('should return Page when is_page is true', () => {
      expect(format.contentType({ options: { is_page: true } })).toBe('Page')
    })

    it('should return Content Block when is_page is false', () => {
      expect(format.contentType({ options: { is_page: false } })).toBe(
        'Content Block'
      )
    })
  })

  describe('allowMultiple', () => {
    it('should return Unknown when contentType or options is missing', () => {
      expect(format.allowMultiple(undefined)).toBe('Unknown')
      expect(format.allowMultiple({})).toBe('Unknown')
    })

    it('should return False when singleton is true', () => {
      expect(format.allowMultiple({ options: { singleton: true } })).toBe(
        'False'
      )
    })

    it('should return True when singleton is false', () => {
      expect(format.allowMultiple({ options: { singleton: false } })).toBe(
        'True'
      )
    })
  })

  describe('urlPattern', () => {
    it('should return Unknown when contentType or options is missing', () => {
      expect(format.urlPattern(undefined)).toBe('Unknown')
      expect(format.urlPattern({})).toBe('Unknown')
    })

    it('should return N/A when url_pattern is missing', () => {
      expect(
        format.urlPattern({ options: { url_prefix: '/blog' } })
      ).toBe('N/A')
    })

    it('should join url_prefix and url_pattern', () => {
      expect(
        format.urlPattern({
          options: {
            url_pattern: ':slug',
            url_prefix: '/articles'
          }
        })
      ).toBe('/articles/:slug')
    })
  })

  describe('checked', () => {
    it('should return asterisk when value is true', () => {
      expect(format.checked(true)).toBe('*')
    })

    it('should return undefined when value is false', () => {
      expect(format.checked(false)).toBeUndefined()
    })
  })
})
