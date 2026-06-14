// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { updateLeadStatus, updateLead, deleteLead } from "@/lib/db/crm";
const VALID_STATUSES = ["New", "Contacted", "Converted", "Lost"];
export async function updateLeadStatusAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Lead id is required" };
    const status = formData.get("status");
    if (!status || !VALID_STATUSES.includes(status)) {
      return { error: "Invalid status" };
    }
    await updateLeadStatus(id, status);
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function updateLeadAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Lead id is required" };
    const name = formData.get("name")?.trim() ?? "";
    if (!name) return { error: "Name is required" };
    const phone = formData.get("phone")?.trim() ?? "";
    if (!phone) return { error: "Phone is required" };
    const businessName = formData.get("businessName")?.trim() || null;
    const notes = formData.get("notes")?.trim() || null;
    const assignedTo = formData.get("assignedTo")?.trim() || null;
    await updateLead(id, { name, phone, businessName, notes, assignedTo });
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function deleteLeadAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Lead id is required" };
    await deleteLead(id);
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
