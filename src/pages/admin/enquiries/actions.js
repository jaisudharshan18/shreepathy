// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { setEnquiryHandled, deleteEnquiry } from "@/lib/db/crm";
export async function setEnquiryHandledAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Enquiry id is required" };
    const handled = formData.get("handled") === "true";
    await setEnquiryHandled(id, handled);
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function deleteEnquiryAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Enquiry id is required" };
    await deleteEnquiry(id);
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
