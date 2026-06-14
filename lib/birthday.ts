/**
 * Pure birthday utility functions — no I/O, no DB, no date side-effects.
 */

/**
 * Generates a birthday discount code for a customer in a given month.
 * Format: BDAY-<referralCode>-<MM><YY>
 */
export function generateBirthdayCode(
  customer: { referralCode: string },
  today: Date,
): string {
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yy = String(today.getFullYear()).slice(-2)
  return `BDAY-${customer.referralCode}-${mm}${yy}`
}

/**
 * Returns true if the customer's birthday falls on the same month+day as today.
 * Ignores year. Returns false if birthday is null.
 */
export function isBirthdayToday(birthday: Date | null, today: Date): boolean {
  if (!birthday) return false
  return (
    birthday.getUTCMonth() === today.getUTCMonth() &&
    birthday.getUTCDate() === today.getUTCDate()
  )
}
