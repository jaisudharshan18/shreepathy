// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { createFaq, updateFaq, deleteFaq } from "@/lib/db/crm";
export async function createFaqAction(formData) {
  try {
    await requireAdmin();
    const question = formData.get("question")?.trim() ?? "";
    if (!question) return { error: "Question is required" };
    const answer = formData.get("answer")?.trim() ?? "";
    if (!answer) return { error: "Answer is required" };
    const sortOrderRaw = formData.get("sortOrder")?.trim();
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;
    await createFaq({
      question,
      answer,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder
    });
    revalidatePath("/admin/chatbot");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function updateFaqAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "FAQ id is required" };
    const question = formData.get("question")?.trim() ?? "";
    if (!question) return { error: "Question is required" };
    const answer = formData.get("answer")?.trim() ?? "";
    if (!answer) return { error: "Answer is required" };
    const sortOrderRaw = formData.get("sortOrder")?.trim();
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;
    await updateFaq(id, {
      question,
      answer,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder
    });
    revalidatePath("/admin/chatbot");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function deleteFaqAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "FAQ id is required" };
    await deleteFaq(id);
    revalidatePath("/admin/chatbot");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
