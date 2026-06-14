// "use server";
const revalidatePath = () => {}
import { requireAdmin } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
import {
  createProduct,
  updateProduct,
  deleteProduct
} from "@/lib/db/catalog";
import { slugify } from "@/lib/utils";
function parseStockStatus(raw) {
  const valid = ["in_stock", "low", "out_of_stock"];
  if (raw && valid.includes(raw)) return raw;
  return "in_stock";
}
function fileFromEntry(entry) {
  if (!entry || typeof entry === "string") return null;
  const f = entry;
  return f.size > 0 ? f : null;
}
export async function createProductAction(formData) {
  try {
    await requireAdmin();
    const name = formData.get("name")?.trim() ?? "";
    if (!name) return { error: "Name is required" };
    const brandId = formData.get("brandId")?.trim() ?? "";
    const categoryId = formData.get("categoryId")?.trim() ?? "";
    const description = formData.get("description")?.trim() ?? "";
    const stockStatus = parseStockStatus(formData.get("stockStatus"));
    const isFeatured = formData.get("isFeatured") === "on";
    const packSize = formData.get("packSize")?.trim() ?? "";
    const packPriceRaw = formData.get("packPrice")?.trim();
    const packPrice = packPriceRaw ? parseFloat(packPriceRaw) : void 0;
    const slug = slugify(name);
    const images = [];
    let modelGlb = null;
    const imageFile = fileFromEntry(formData.get("image"));
    if (imageFile) {
      const url = await uploadFile("product-images", imageFile, "products");
      images.push(url);
    }
    const modelFile = fileFromEntry(formData.get("model"));
    if (modelFile) {
      modelGlb = await uploadFile("product-models", modelFile, "models");
    }
    await createProduct({
      name,
      slug,
      brandId,
      categoryId,
      description,
      images,
      modelGlb,
      stockStatus,
      isFeatured,
      variants: packSize ? [{ size: packSize, price: packPrice != null && !isNaN(packPrice) ? packPrice : null }] : []
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function updateProductAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Product id is required" };
    const name = formData.get("name")?.trim() ?? "";
    if (!name) return { error: "Name is required" };
    const brandId = formData.get("brandId")?.trim() ?? "";
    const categoryId = formData.get("categoryId")?.trim() ?? "";
    const description = formData.get("description")?.trim() ?? "";
    const stockStatus = parseStockStatus(formData.get("stockStatus"));
    const isFeatured = formData.get("isFeatured") === "on";
    const packSize = formData.get("packSize")?.trim() ?? "";
    const packPriceRaw = formData.get("packPrice")?.trim();
    const packPrice = packPriceRaw ? parseFloat(packPriceRaw) : void 0;
    const slug = slugify(name);
    const existingImageUrl = formData.get("existingImageUrl")?.trim() ?? "";
    const existingGlbUrl = formData.get("existingGlbUrl")?.trim() ?? "";
    let images = existingImageUrl ? [existingImageUrl] : [];
    let modelGlb = existingGlbUrl || null;
    const imageFile = fileFromEntry(formData.get("image"));
    if (imageFile) {
      const url = await uploadFile("product-images", imageFile, "products");
      images = [url];
    }
    const modelFile = fileFromEntry(formData.get("model"));
    if (modelFile) {
      modelGlb = await uploadFile("product-models", modelFile, "models");
    }
    await updateProduct(id, {
      name,
      slug,
      brandId,
      categoryId,
      description,
      images,
      modelGlb,
      stockStatus,
      isFeatured,
      variants: packSize ? [{ size: packSize, price: packPrice != null && !isNaN(packPrice) ? packPrice : null }] : []
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
export async function deleteProductAction(formData) {
  try {
    await requireAdmin();
    const id = formData.get("id")?.trim() ?? "";
    if (!id) return { error: "Product id is required" };
    await deleteProduct(id);
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { ok: true };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
