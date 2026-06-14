// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { upsertSiteContent } from "@/lib/db/content";
export async function saveContentAction(formData) {
  try {
    await requireAdmin();
    const heroHeadline = formData.get("heroHeadline")?.trim() ?? "";
    if (!heroHeadline) return { error: "Hero headline is required" };
    const heroSubtext = formData.get("heroSubtext")?.trim() ?? "";
    const ctaLabel = formData.get("ctaLabel")?.trim() ?? "";
    const aboutCopy = formData.get("aboutCopy")?.trim() ?? "";
    const contactPhone = formData.get("contactPhone")?.trim() ?? "";
    const contactEmail = formData.get("contactEmail")?.trim() ?? "";
    const contactAddress = formData.get("contactAddress")?.trim() ?? "";
    const mapEmbedUrl = formData.get("mapEmbedUrl")?.trim() ?? "";
    await upsertSiteContent({
      heroHeadline,
      heroSubtext,
      ctaLabel,
      aboutCopy,
      contactPhone,
      contactEmail,
      contactAddress,
      mapEmbedUrl
    });
    revalidatePath("/admin/content");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
