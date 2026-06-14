export async function getSettings() {
  return {
    whatsappNumber: "919999999999",
    businessName: "Shreepathy & Co",
    businessHours: "Mon–Sat 9 AM – 6 PM",
    seoTitle: "Shreepathy & Co — Wholesale Bakery & Food Ingredients",
    seoDescription: "Buy bakery ingredients, syrups, dairy and frozen food products wholesale from Shreepathy & Co, Bangalore."
  };
}
export async function upsertSettings(data) {
  return data;
}
