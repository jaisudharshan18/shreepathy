import { pointsForOrder } from "@/lib/loyalty";
export const REFERRAL_POINTS = 500;
const mockProfile = {
  id: "mock-customer-id",
  userId: "mock-user-id",
  businessName: "Shreepathy Wholesale Bakery",
  contactName: "Jane Doe",
  phone: "919999999999",
  email: "admin@shreepathy.com",
  tier: "Gold",
  pointsBalance: 1250,
  referralCode: "SHRP-ABCXYZ",
  registeredAt: /* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z"),
  birthday: /* @__PURE__ */ new Date("1990-06-15T00:00:00.000Z")
};
const mockOrders = [
  {
    id: "ord-1",
    customerId: "mock-customer-id",
    totalValue: 15e3,
    status: "logged",
    loggedBy: "Shreepathy Admin",
    createdAt: /* @__PURE__ */ new Date("2026-06-01T10:00:00.000Z"),
    items: [
      { id: "item-1", orderId: "ord-1", productId: "p1", name: "Premium Cake Premix", size: "25kg", qty: 5, unitValue: 3e3 }
    ],
    customer: {
      businessName: "Shreepathy Wholesale Bakery",
      contactName: "Jane Doe"
    }
  }
];
export async function getProfile(id) {
  return mockProfile;
}
export async function getOrders(customerId) {
  return mockOrders.filter((o) => o.customerId === customerId);
}
export async function getAllOrders() {
  return mockOrders;
}
export async function getProfileByUserId(userId) {
  return mockProfile;
}
export async function createProfile(input) {
  return {
    id: "mock-customer-id",
    userId: input.userId,
    businessName: input.businessName,
    contactName: input.contactName,
    phone: input.phone,
    email: input.email,
    tier: "Silver",
    pointsBalance: 0,
    referralCode: "SHRP-NEW123",
    registeredAt: /* @__PURE__ */ new Date(),
    birthday: null
  };
}
export async function creditReferral(referrerCode, referredId) {
  return null;
}
export async function runBirthdayOffers(today) {
  return [];
}
export async function updateCustomer(id, data) {
  return { ...mockProfile, ...data };
}
export async function createLoggedOrder(input) {
  const total = input.items.reduce((sum, item) => sum + item.qty * item.unitValue, 0);
  const pointsAwarded = pointsForOrder(total);
  const newOrder = {
    id: "ord-" + Date.now(),
    customerId: input.customerId,
    totalValue: total,
    status: "logged",
    loggedBy: input.loggedBy || "System",
    createdAt: /* @__PURE__ */ new Date(),
    items: input.items.map((item, index) => ({
      id: `item-${Date.now()}-${index}`,
      productId: item.productId,
      name: item.name,
      size: item.size,
      qty: item.qty,
      unitValue: item.unitValue
    }))
  };
  mockOrders.push(newOrder);
  return { order: { id: newOrder.id, totalValue: total }, pointsAwarded };
}
