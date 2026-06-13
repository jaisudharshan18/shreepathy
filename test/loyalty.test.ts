import { describe, it, expect } from 'vitest'
import { tierForValue, pointsForOrder } from '@/lib/mock/loyalty'
describe('loyalty', () => {
  it('Silver under 50k', () => expect(tierForValue(10000)).toBe('Silver'))
  it('Gold at 50k', () => expect(tierForValue(50000)).toBe('Gold'))
  it('Platinum at 200k', () => expect(tierForValue(200000)).toBe('Platinum'))
  it('1 point per 100 spent', () => expect(pointsForOrder(2500)).toBe(25))
})
