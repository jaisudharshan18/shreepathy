import { useParams, useSearchParams } from 'react-router-dom';
import { createAsyncPage } from '@/lib/asyncPage';
import { requireAdmin } from "@/lib/auth";
import { getAllOrders } from "@/lib/db/account";
import { getCustomers } from "@/lib/db/crm";
import { getProducts } from "@/lib/db/catalog";
import OrdersAdmin from "./OrdersAdmin";
async function OrdersPage() {
  await requireAdmin();
  const [orders, customers, products] = await Promise.all([
    getAllOrders(),
    getCustomers(),
    getProducts()
  ]);
  return <OrdersAdmin orders={orders} customers={customers} products={products} />;
}

export default createAsyncPage(OrdersPage);
