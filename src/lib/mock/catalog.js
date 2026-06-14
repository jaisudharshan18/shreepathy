import { products, brands, categories } from "./data";
export function getProducts() {
  return products;
}
export function getProduct(slug) {
  return products.find((p) => p.slug === slug);
}
export function searchProducts(q) {
  const t = q.toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(t));
}
export function getBrands() {
  return brands;
}
export function getBrand(slug) {
  return brands.find((b) => b.slug === slug);
}
export function getBrandById(id) {
  return brands.find((b) => b.id === id);
}
export function getCategories() {
  return categories;
}
export function getCategory(slug) {
  return categories.find((c) => c.slug === slug);
}
export function getCategoryById(id) {
  return categories.find((c) => c.id === id);
}
