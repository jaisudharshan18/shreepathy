import { customers, orders } from "./data";
export function getProfile(id) {
  return customers.find((c) => c.id === id);
}
export function getOrders(customerId) {
  return orders.filter((o) => o.customerId === customerId);
}
