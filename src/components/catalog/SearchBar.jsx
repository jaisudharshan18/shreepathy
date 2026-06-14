"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
export function SearchBar({ value, onSearch }) {
  return <div className="relative w-full max-w-md"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" /><Input
    type="search"
    placeholder="Search products..."
    value={value}
    onChange={(e) => onSearch(e.target.value)}
    className="pl-9"
  /></div>;
}
