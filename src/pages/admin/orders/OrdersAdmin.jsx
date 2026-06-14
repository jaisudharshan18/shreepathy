"use client";
import { useState, useTransition } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatINR } from "@/lib/utils";
import { createOrderAction } from "./actions";
const STATUS_VARIANT = {
  logged: "secondary",
  confirmed: "outline",
  delivered: "default",
  cancelled: "destructive"
};
export default function OrdersAdmin({ orders, customers, products }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loyaltyNote, setLoyaltyNote] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [customerIdSelect, setCustomerIdSelect] = useState(customers[0]?.id ?? "");
  const [productIdSelect, setProductIdSelect] = useState(products[0]?.id ?? "");
  const selectedProduct = products.find((p) => p.id === productIdSelect);
  const firstVariant = selectedProduct?.variants[0];
  function openAdd() {
    setError(null);
    setLoyaltyNote(null);
    setCustomerIdSelect(customers[0]?.id ?? "");
    setProductIdSelect(products[0]?.id ?? "");
    setDialogOpen(true);
  }
  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set("customerId", customerIdSelect);
    fd.set("productId", productIdSelect);
    fd.set("productName", selectedProduct?.name ?? "");
    fd.set("size", firstVariant?.size ?? "");
    startTransition(async () => {
      const result = await createOrderAction(fd);
      if ("error" in result) {
        setError(result.error);
      } else {
        setLoyaltyNote(`Order logged. Awarded ${result.pointsAwarded} loyalty points.`);
        setError(null);
      }
    });
  }
  const columns = [
    {
      key: "id",
      header: "Order ID",
      render: (row) => <span className="font-mono text-xs">{row.id.slice(0, 8)}…</span>
    },
    {
      key: "customerId",
      header: "Customer",
      render: (row) => <span>{row.customer.businessName}</span>
    },
    {
      key: "totalValue",
      header: "Items",
      render: (row) => <span>{row.items.length}</span>
    },
    {
      key: "status",
      header: "Total",
      render: (row) => <span>{formatINR(row.totalValue)}</span>
    },
    {
      key: "loggedBy",
      header: "Status",
      render: (row) => <Badge variant={STATUS_VARIANT[row.status.toLowerCase()] ?? "outline"}>{row.status}</Badge>
    },
    {
      key: "createdAt",
      header: "Date",
      render: (row) => <span>{row.createdAt.toISOString().slice(0, 10)}</span>
    }
  ];
  return <div className="space-y-4"><div className="flex items-center justify-between"><h1 className="text-xl font-semibold">Orders</h1><Button onClick={openAdd}>Log Order</Button></div><DataTable columns={columns} data={orders} /><Dialog
    open={dialogOpen}
    onOpenChange={(open) => {
      setDialogOpen(open);
      if (!open) {
        setLoyaltyNote(null);
        setError(null);
      }
    }}
  ><DialogContent><DialogHeader><DialogTitle>Log Order</DialogTitle><DialogDescription>
              Log a single-item order. Points are awarded automatically.
            </DialogDescription></DialogHeader><form onSubmit={handleSubmit}><div className="grid gap-3 py-2">{
    /* Customer */
  }<div className="grid gap-1"><Label>Customer</Label><input type="hidden" name="customerId" value={customerIdSelect} /><Select
    value={customerIdSelect}
    onValueChange={(v) => {
      if (v) setCustomerIdSelect(v);
    }}
  ><SelectTrigger className="w-full"><SelectValue placeholder="Select customer" /></SelectTrigger><SelectContent>{customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.businessName}</SelectItem>)}</SelectContent></Select></div>{
    /* Product */
  }<div className="grid gap-1"><Label>Product</Label><input type="hidden" name="productId" value={productIdSelect} /><Select
    value={productIdSelect}
    onValueChange={(v) => {
      if (v) setProductIdSelect(v);
    }}
  ><SelectTrigger className="w-full"><SelectValue placeholder="Select product" /></SelectTrigger><SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>{
    /* Qty + Unit Value */
  }<div className="grid grid-cols-2 gap-3"><div className="grid gap-1"><Label>Quantity</Label><Input
    type="number"
    name="qty"
    min="1"
    defaultValue="1"
  /></div><div className="grid gap-1"><Label>Unit Value (₹)</Label><Input
    type="number"
    name="unitValue"
    min="0"
    step="0.01"
    defaultValue={firstVariant?.price != null ? String(firstVariant.price) : ""}
    placeholder="e.g. 220"
  /></div></div>{error && <p className="text-sm text-destructive">{error}</p>}{loyaltyNote && <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{loyaltyNote}</p>}</div><DialogFooter showCloseButton>{!loyaltyNote && <Button type="submit" disabled={isPending}>{isPending ? "Logging…" : "Log Order"}</Button>}</DialogFooter></form></DialogContent></Dialog></div>;
}
