import type { Tier } from '@/lib/types'
export function tierForValue(cumulative: number): Tier {
  if (cumulative >= 200000) return 'Platinum'
  if (cumulative >= 50000) return 'Gold'
  return 'Silver'
}
export function pointsForOrder(orderValue: number): number {
  return Math.floor(orderValue / 100)
}
