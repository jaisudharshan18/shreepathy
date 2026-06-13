import { describe, it, expect } from 'vitest'
import { whatsappLink, formatINR, slugify } from '@/lib/utils'
describe('utils', () => {
  it('whatsappLink encodes message', () => { expect(whatsappLink('hi there')).toContain('hi%20there') })
  it('formatINR adds rupee', () => { expect(formatINR(1000)).toContain('1,000') })
  it('slugify normalizes', () => { expect(slugify('Bakery Raw Material')).toBe('bakery-raw-material') })
})
