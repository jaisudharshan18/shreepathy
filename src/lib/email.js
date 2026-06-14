export async function sendEmail({ to, subject, html }) {
  console.log("[Mock Email Sent]", { to, subject, html });
  return { ok: true };
}
export async function sendAdminEmail({ subject, html }) {
  console.log("[Mock Admin Email Sent]", { subject, html });
  return { ok: true };
}
