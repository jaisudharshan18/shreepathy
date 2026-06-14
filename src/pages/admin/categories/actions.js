// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { createCategory, updateCategory, deleteCategory } from "@/lib/db/catalog";
import { slugify } from "@/lib/utils";
export async function createCategoryAction(formData) {
  try {
    await requireAdmin();
    const name = formData.get("name")?.trim() ?? "";
    if (!name) return { error: "Name is required" };
    const sortOrderRaw = formData.get("sortOrder")?.trim();
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;
    await createCategory({
      name,
      slug: slugify(name),
      image: null,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder
    });
    revalidatePath("/admin/categories");
    revalidatePath("/");
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function updateCategoryAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Category id is required" };
    const name = formData.get("name")?.trim() ?? "";
    if (!name) return { error: "Name is required" };
    const sortOrderRaw = formData.get("sortOrder")?.trim();
    const sortOrder = sortOrderRaw ? parseInt(sortOrderRaw, 10) : 0;
    await updateCategory(id, {
      name,
      slug: slugify(name),
      image: null,
      sortOrder: isNaN(sortOrder) ? 0 : sortOrder
    });
    revalidatePath("/admin/categories");
    revalidatePath("/");
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function deleteCategoryAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Category id is required" };
    await deleteCategory(id);
    revalidatePath("/admin/categories");
    revalidatePath("/");
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
