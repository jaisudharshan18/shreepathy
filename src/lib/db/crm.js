const mockLeads = [
  {
    id: "lead-1",
    name: "Alice Johnson",
    phone: "919876543210",
    businessName: "Alice Sweet Treats",
    status: "New",
    source: "Website",
    notes: "Interested in cake premix pricing.",
    assignedTo: "Jane Doe",
    createdAt: /* @__PURE__ */ new Date("2026-06-12T09:00:00.000Z")
  },
  {
    id: "lead-2",
    name: "Bob Smith",
    phone: "919876543211",
    businessName: "Bob Bakery",
    status: "Contacted",
    source: "Referral",
    notes: "Requested samples of whip topping cream.",
    assignedTo: "Jane Doe",
    createdAt: /* @__PURE__ */ new Date("2026-06-11T11:00:00.000Z")
  }
];
const mockCustomers = [
  {
    id: "mock-customer-id",
    userId: "mock-user-id",
    businessName: "Shreepathy Wholesale Bakery",
    contactName: "Jane Doe",
    phone: "919999999999",
    email: "admin@shreepathy.com",
    tier: "Gold",
    pointsBalance: 1250,
    referralCode: "SHRP-ABCXYZ",
    registeredAt: /* @__PURE__ */ new Date("2026-01-01T00:00:00.000Z")
  }
];
const mockEnquiries = [
  {
    id: "enq-1",
    name: "Charlie Brown",
    phone: "919876543212",
    business: "Charlie Cakes",
    products: "Premium Cake Premix, Whip Topping Cream",
    quantity: "10 bags, 5 cases",
    location: "Bangalore",
    message: "Please send wholesale catalog.",
    handled: false,
    createdAt: /* @__PURE__ */ new Date("2026-06-13T14:30:00.000Z")
  }
];
const mockFaqs = [
  {
    id: "faq-1",
    question: "What is the minimum order quantity (MOQ)?",
    answer: "Our standard MOQ varies by product, typically starting from 1 box/bag for wholesale accounts.",
    sortOrder: 1
  },
  {
    id: "faq-2",
    question: "Do you deliver across Tamil Nadu?",
    answer: "Yes, we provide delivery services across Bangalore and major cities in Tamil Nadu.",
    sortOrder: 2
  }
];
export async function getLeads() {
  return mockLeads;
}
export async function getCustomers() {
  return mockCustomers;
}
export async function getEnquiries() {
  return mockEnquiries;
}
export async function getFaqs() {
  return mockFaqs;
}
export async function createFaq(data) {
  const newFaq = { id: "faq-" + Date.now(), ...data };
  mockFaqs.push(newFaq);
  return newFaq;
}
export async function updateFaq(id, data) {
  const idx = mockFaqs.findIndex((f) => f.id === id);
  if (idx !== -1) {
    mockFaqs[idx] = { ...mockFaqs[idx], ...data };
    return mockFaqs[idx];
  }
  return null;
}
export async function deleteFaq(id) {
  const idx = mockFaqs.findIndex((f) => f.id === id);
  if (idx !== -1) {
    return mockFaqs.splice(idx, 1)[0];
  }
  return null;
}
export async function updateLeadStatus(id, status) {
  const idx = mockLeads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    mockLeads[idx].status = status;
    return mockLeads[idx];
  }
  return null;
}
export async function updateLead(id, data) {
  const idx = mockLeads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    mockLeads[idx] = { ...mockLeads[idx], ...data };
    return mockLeads[idx];
  }
  return null;
}
export async function deleteLead(id) {
  const idx = mockLeads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    return mockLeads.splice(idx, 1)[0];
  }
  return null;
}
export async function createEnquiry(data) {
  const newEnq = { id: "enq-" + Date.now(), ...data, handled: false, createdAt: /* @__PURE__ */ new Date() };
  mockEnquiries.push(newEnq);
  return newEnq;
}
export async function setEnquiryHandled(id, handled) {
  const idx = mockEnquiries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    mockEnquiries[idx].handled = handled;
    return mockEnquiries[idx];
  }
  return null;
}
export async function deleteEnquiry(id) {
  const idx = mockEnquiries.findIndex((e) => e.id === id);
  if (idx !== -1) {
    return mockEnquiries.splice(idx, 1)[0];
  }
  return null;
}
export async function createLead(data) {
  const newLead = { id: "lead-" + Date.now(), ...data, status: "New", createdAt: /* @__PURE__ */ new Date() };
  mockLeads.push(newLead);
  return newLead;
}
