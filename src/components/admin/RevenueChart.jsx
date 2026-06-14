"use client";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
function fmtRevenue(v) {
  if (v == null) return "—";
  return `₹${v.toLocaleString("en-IN")}`;
}
function fmtAxis(v) {
  if (v == null) return "";
  return `₹${(v / 1e3).toFixed(0)}k`;
}
export function RevenueChart({ data }) {
  return <ResponsiveContainer width="100%" height={300}><LineChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 8 }}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} tickFormatter={fmtAxis} /><Tooltip formatter={(value) => [fmtRevenue(value), "Revenue"]} /><Line
    type="monotone"
    dataKey="revenue"
    stroke="#e6007e"
    strokeWidth={2}
    dot={{ r: 4, fill: "#e6007e" }}
    activeDot={{ r: 6 }}
  /></LineChart></ResponsiveContainer>;
}
