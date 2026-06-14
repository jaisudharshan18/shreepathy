const mockSummary = {
  revenue: 125e3,
  customerCount: 42,
  leadCount: 15,
  orderCount: 88,
  revenueByMonth: [
    { month: "Jan", revenue: 15e3 },
    { month: "Feb", revenue: 18e3 },
    { month: "Mar", revenue: 22e3 },
    { month: "Apr", revenue: 2e4 },
    { month: "May", revenue: 25e3 },
    { month: "Jun", revenue: 25e3 }
  ]
};
const mockBestSellers = [
  { rank: 1, product: "Premium Cake Premix", unitsSold: 120 },
  { rank: 2, product: "Whip Topping Cream", unitsSold: 95 },
  { rank: 3, product: "Dark Chocolate Compound", unitsSold: 80 },
  { rank: 4, product: "Monin Mojito Syrup", unitsSold: 64 },
  { rank: 5, product: "Bread Improver", unitsSold: 42 }
];
const mockAtRiskCustomers = [
  { customer: "Bangalore Bakers", lastOrder: "2026-04-10", note: "No order in 60+ days" },
  { customer: "Star Sweets & Savouries", lastOrder: "2026-03-15", note: "No order in 90+ days" },
  { customer: "Royal Cake Shop", lastOrder: "2026-02-28", note: "No order in 100+ days" }
];
export async function getAnalyticsSummary() {
  return mockSummary;
}
export async function getBestSellers() {
  return mockBestSellers;
}
export async function getRepeatCustomerPct() {
  return "75%";
}
export async function getAtRiskCustomers() {
  return mockAtRiskCustomers;
}
