// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { customers } from "@/lib/mock/data";
import { runBirthdayOffers } from "@/lib/db/account";
export async function adjustPointsAction(formData) {
  try {
    await requireAdmin();
    const customerId = formData.get("customerId")?.trim() ?? "";
    if (!customerId) return { error: "Customer is required" };
    const deltaRaw = formData.get("pointsDelta")?.trim() ?? "";
    const delta = parseInt(deltaRaw, 10);
    if (isNaN(delta) || delta === 0) return { error: "Points delta must be a non-zero integer" };
    const reason = formData.get("reason")?.trim() ?? "";
    if (!reason) return { error: "Reason is required" };

    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      customer.pointsBalance = (customer.pointsBalance || 0) + delta;
    }
    
    revalidatePath("/admin/loyalty");
    revalidatePath("/admin/customers");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function runBirthdayOffersAction() {
  try {
    await requireAdmin();
    const results = await runBirthdayOffers(/* @__PURE__ */ new Date());
    revalidatePath("/admin/loyalty");
    return { ok: true, count: results.length };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
