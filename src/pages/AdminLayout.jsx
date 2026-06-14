import { Outlet } from 'react-router-dom';
import { AdminSidebar } from "@/components/layout/AdminSidebar";
export default function AdminLayout() {
  return <div className="flex min-h-screen"><AdminSidebar /><main className="flex-1 bg-muted/30 p-6 min-h-screen"><Outlet /></main></div>;
}
