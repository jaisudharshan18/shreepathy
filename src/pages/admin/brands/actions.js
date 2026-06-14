// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
import { createBrand, updateBrand, deleteBrand } from "@/lib/db/catalog";
import { slugify } from "@/lib/utils";
function fileFromEntry(entry) {
  if (!entry || typeof entry === "string") return null;
  const f = entry;
  return f.size > 0 ? f : null;
}
export async function createBrandAction(formData) {
  try {
    await requireAdmin();
    const name = formData.get("name")?.trim() ?? "";
    if (!name) return { error: "Name is required" };
    const description = formData.get("description")?.trim() || null;
    let logo = null;
    const logoFile = fileFromEntry(formData.get("logo"));
    if (logoFile) {
      logo = await uploadFile("product-images", logoFile, "brands");
    }
    await createBrand({
      name,
      slug: slugify(name),
      description,
      logo
    });
    revalidatePath("/admin/brands");
    revalidatePath("/");
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function updateBrandAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Brand id is required" };
    const name = formData.get("name")?.trim() ?? "";
    if (!name) return { error: "Name is required" };
    const description = formData.get("description")?.trim() || null;
    const existingLogo = formData.get("existingLogo")?.trim() || null;
    let logo = existingLogo;
    const logoFile = fileFromEntry(formData.get("logo"));
    if (logoFile) {
      logo = await uploadFile("product-images", logoFile, "brands");
    }
    await updateBrand(id, {
      name,
      slug: slugify(name),
      description,
      logo
    });
    revalidatePath("/admin/brands");
    revalidatePath("/");
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function deleteBrandAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Brand id is required" };
    await deleteBrand(id);
    revalidatePath("/admin/brands");
    revalidatePath("/");
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
