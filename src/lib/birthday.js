export function generateBirthdayCode(customer, today) {
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const yy = String(today.getFullYear()).slice(-2);
  return `BDAY-${customer.referralCode}-${mm}${yy}`;
}
export function isBirthdayToday(birthday, today) {
  if (!birthday) return false;
  return birthday.getUTCMonth() === today.getUTCMonth() && birthday.getUTCDate() === today.getUTCDate();
}
