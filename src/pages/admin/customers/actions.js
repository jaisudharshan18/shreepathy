// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { updateCustomer } from "@/lib/db/account";
const VALID_TIERS = ["Silver", "Gold", "Platinum"];
export async function updateCustomerAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Customer id is required" };
    const businessName = formData.get("businessName")?.trim();
    const contactName = formData.get("contactName")?.trim();
    const phone = formData.get("phone")?.trim();
    const tierRaw = formData.get("tier")?.trim();
    const tier = tierRaw && VALID_TIERS.includes(tierRaw) ? tierRaw : void 0;
    const pointsRaw = formData.get("pointsBalance")?.trim();
    const pointsBalance = pointsRaw !== void 0 && pointsRaw !== "" ? parseInt(pointsRaw, 10) : void 0;
    await updateCustomer(id, {
      ...businessName !== void 0 && businessName !== "" ? { businessName } : {},
      ...contactName !== void 0 && contactName !== "" ? { contactName } : {},
      ...phone !== void 0 && phone !== "" ? { phone } : {},
      ...tier !== void 0 ? { tier } : {},
      ...pointsBalance !== void 0 && !isNaN(pointsBalance) ? { pointsBalance } : {}
    });
    revalidatePath("/admin/customers");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
