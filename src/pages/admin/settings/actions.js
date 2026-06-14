// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { upsertSettings } from "@/lib/db/settings";
export async function saveSettingsAction(formData) {
  try {
    await requireAdmin();
    const whatsappNumber = formData.get("whatsappNumber")?.trim() ?? "";
    if (!whatsappNumber) return { error: "WhatsApp number is required" };
    const businessName = formData.get("businessName")?.trim() ?? "";
    if (!businessName) return { error: "Business name is required" };
    const businessHours = formData.get("businessHours")?.trim() ?? "";
    const seoTitle = formData.get("seoTitle")?.trim() ?? "";
    const seoDescription = formData.get("seoDescription")?.trim() ?? "";
    await upsertSettings({
      whatsappNumber,
      businessName,
      businessHours,
      seoTitle,
      seoDescription
    });
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
