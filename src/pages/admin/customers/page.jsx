import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getCustomers } from "@/lib/db/crm";
import { getAllOrders } from "@/lib/db/account";
import CustomersAdmin from "./CustomersAdmin";
async function CustomersPage() {
  await requireAdmin();
  const [customers, allOrders] = await Promise.all([
    getCustomers(),
    getAllOrders()
  ]);
  const ordersByCustomer = {};
  for (const order of allOrders) {
    const { customer: _customer, ...orderWithoutCustomer } = order;
    if (!ordersByCustomer[order.customerId]) {
      ordersByCustomer[order.customerId] = [];
    }
    ordersByCustomer[order.customerId].push(orderWithoutCustomer);
  }
  return <CustomersAdmin customers={customers} ordersByCustomer={ordersByCustomer} />;
}

export default createAsyncPage(CustomersPage);
