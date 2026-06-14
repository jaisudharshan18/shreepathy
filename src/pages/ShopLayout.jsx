import { Outlet } from 'react-router-dom';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthNav } from "@/components/layout/AuthNav";
export default function ShopLayout() {
  return <><Header authSlot={<AuthNav />} /><main className="min-h-screen"><Outlet /></main><Footer /></>;
}
