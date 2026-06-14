export function tierForValue(cumulative) {
  if (cumulative >= 2e5) return "Platinum";
  if (cumulative >= 5e4) return "Gold";
  return "Silver";
}
export function pointsForOrder(orderValue) {
  return Math.floor(orderValue / 100);
}
