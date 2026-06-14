import {
  categories as mockCategories,
  brands as mockBrands,
  products as mockProducts
} from "@/lib/mock/data";
function mapMockProduct(prod) {
  const mockBrand = mockBrands.find((b) => b.id === prod.brandId);
  const brand = mockBrand ? {
    id: mockBrand.id,
    name: mockBrand.name,
    slug: mockBrand.slug,
    logo: mockBrand.logo ?? null,
    description: mockBrand.description ?? null
  } : {
    id: prod.brandId,
    name: "Unknown Brand",
    slug: "unknown-brand",
    logo: null,
    description: null
  };
  const mockCategory = mockCategories.find((c) => c.id === prod.categoryId);
  const category = mockCategory ? {
    id: mockCategory.id,
    name: mockCategory.name,
    slug: mockCategory.slug,
    image: mockCategory.image ?? null,
    sortOrder: mockCategory.sortOrder
  } : {
    id: prod.categoryId,
    name: "Unknown Category",
    slug: "unknown-category",
    image: null,
    sortOrder: 0
  };
  return {
    id: prod.id,
    name: prod.name,
    slug: prod.slug,
    brandId: prod.brandId,
    categoryId: prod.categoryId,
    description: prod.description,
    images: prod.images,
    modelGlb: prod.modelGlb ?? null,
    stockStatus: prod.stockStatus,
    isFeatured: prod.isFeatured,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    brand,
    category,
    variants: prod.variants.map((v, index) => ({
      id: `${prod.id}-v-${index}`,
      productId: prod.id,
      size: v.size,
      price: v.price ?? null,
      image: v.image ?? null
    }))
  };
}
export async function getProducts() {
  return mockProducts.map(mapMockProduct);
}
export async function getProduct(slug) {
  const prod = mockProducts.find((p) => p.slug === slug);
  return prod ? mapMockProduct(prod) : null;
}
export async function searchProducts(q) {
  const lowerQ = q.toLowerCase();
  return mockProducts.filter((p) => p.name.toLowerCase().includes(lowerQ)).map(mapMockProduct);
}
export async function filterProducts(f) {
  let filtered = [...mockProducts];
  if (f.categoryId) {
    filtered = filtered.filter((p) => p.categoryId === f.categoryId);
  }
  if (f.brandId) {
    filtered = filtered.filter((p) => p.brandId === f.brandId);
  }
  if (f.size) {
    filtered = filtered.filter((p) => p.variants.some((v) => v.size === f.size));
  }
  return filtered.map(mapMockProduct);
}
export async function getBrands() {
  return mockBrands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo ?? null,
    description: b.description ?? null
  }));
}
export async function getBrand(slug) {
  const b = mockBrands.find((brand) => brand.slug === slug);
  return b ? {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo ?? null,
    description: b.description ?? null
  } : null;
}
export async function getBrandById(id) {
  const b = mockBrands.find((brand) => brand.id === id);
  return b ? {
    id: b.id,
    name: b.name,
    slug: b.slug,
    logo: b.logo ?? null,
    description: b.description ?? null
  } : null;
}
export async function getCategories() {
  return [...mockCategories].sort((a, b) => a.sortOrder - b.sortOrder).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? null,
    sortOrder: c.sortOrder
  }));
}
export async function getCategory(slug) {
  const c = mockCategories.find((cat) => cat.slug === slug);
  return c ? {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? null,
    sortOrder: c.sortOrder
  } : null;
}
export async function getCategoryById(id) {
  const c = mockCategories.find((cat) => cat.id === id);
  return c ? {
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image ?? null,
    sortOrder: c.sortOrder
  } : null;
}
export async function createCategory(data) {
  const newCat = { id: "cat-" + Date.now(), ...data };
  mockCategories.push(newCat);
  return newCat;
}
export async function updateCategory(id, data) {
  const idx = mockCategories.findIndex((c) => c.id === id);
  if (idx !== -1) {
    mockCategories[idx] = { ...mockCategories[idx], ...data };
    return mockCategories[idx];
  }
  return null;
}
export async function deleteCategory(id) {
  const idx = mockCategories.findIndex((c) => c.id === id);
  if (idx !== -1) {
    return mockCategories.splice(idx, 1)[0];
  }
  return null;
}
export async function createBrand(data) {
  const newBrand = { id: "brand-" + Date.now(), ...data };
  mockBrands.push(newBrand);
  return newBrand;
}
export async function updateBrand(id, data) {
  const idx = mockBrands.findIndex((b) => b.id === id);
  if (idx !== -1) {
    mockBrands[idx] = { ...mockBrands[idx], ...data };
    return mockBrands[idx];
  }
  return null;
}
export async function deleteBrand(id) {
  const idx = mockBrands.findIndex((b) => b.id === id);
  if (idx !== -1) {
    return mockBrands.splice(idx, 1)[0];
  }
  return null;
}
export async function createProduct(data) {
  const newProd = { id: "prod-" + Date.now(), ...data };
  mockProducts.push(newProd);
  return mapMockProduct(newProd);
}
export async function updateProduct(id, data) {
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx !== -1) {
    mockProducts[idx] = { ...mockProducts[idx], ...data };
    return mapMockProduct(mockProducts[idx]);
  }
  return null;
}
export async function deleteProduct(id) {
  const idx = mockProducts.findIndex((p) => p.id === id);
  if (idx !== -1) {
    return mockProducts.splice(idx, 1)[0];
  }
  return null;
}
