// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { createLoggedOrder } from "@/lib/db/account";
export async function createOrderAction(formData) {
  try {
    await requireAdmin();
    const customerId = formData.get("customerId")?.trim() ?? "";
    if (!customerId) return { error: "Customer is required" };
    const productId = formData.get("productId")?.trim() ?? "";
    if (!productId) return { error: "Product is required" };
    const productName = formData.get("productName")?.trim() ?? "";
    const size = formData.get("size")?.trim() ?? "";
    const qtyRaw = formData.get("qty")?.trim() ?? "1";
    const qty = Math.max(1, parseInt(qtyRaw, 10) || 1);
    const unitValueRaw = formData.get("unitValue")?.trim() ?? "";
    const unitValue = parseFloat(unitValueRaw);
    if (isNaN(unitValue) || unitValue <= 0) return { error: "Valid unit value is required" };
    const { pointsAwarded } = await createLoggedOrder({
      customerId,
      items: [{ productId, name: productName, size, qty, unitValue }]
    });
    revalidatePath("/admin/orders");
    revalidatePath("/admin/customers");
    revalidatePath("/admin/analytics");
    revalidatePath("/admin");
    return { ok: true, pointsAwarded };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
