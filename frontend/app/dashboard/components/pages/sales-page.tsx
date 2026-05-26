"use client";

import { useState } from "react";
import { DataTable } from "@/app/dashboard/components/dashboard/data-table";
import { FilterBar } from "@/app/dashboard/components/dashboard/filter-bar";
import { DateRangePicker } from "@/app/dashboard/components/dashboard/date-range-picker";
import { StatCard } from "@/app/dashboard/components/dashboard/stat-card";
import { ShoppingCart, TrendingUp, DollarSign } from "lucide-react";
import { Merchant } from "@/types";

interface SalesPageProps {
  merchant?: Merchant | null;
}

export function SalesPage({ merchant }: SalesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setDateRange] = useState({ start: "", end: "" });

  const sales = Array.isArray(merchant?.selledStocks) ? merchant.selledStocks : [];
  const activeSales = sales.filter((s: any) => s.status !== "cancelled");

  // Calculate dynamic stats
  const totalSalesVal = activeSales.reduce((sum: number, s: any) => sum + s.total_price, 0);
  const totalOrders = activeSales.length;
  const avgOrderVal = totalOrders > 0 ? Math.round(totalSalesVal / totalOrders) : 0;

  const salesData = sales.map((s: any) => ({
    id: s.id.substring(0, 8).toUpperCase(),
    date: new Date(s.created_at).toLocaleDateString("id-ID"),
    customer: `Pelanggan #${s.user_id.substring(0, 4).toUpperCase()}`,
    amount: `Rp ${s.total_price.toLocaleString("id-ID")}`,
    status: s.status.charAt(0).toUpperCase() + s.status.slice(1),
  }));

  const filteredData = salesData.filter(
    (item) =>
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)} Jt`;
    }
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="lg:flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Sales Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your sales orders
          </p>
        </div>
        <DateRangePicker
          onDateChange={(start, end) => setDateRange({ start, end })}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
        <StatCard
          title="Total Sales"
          value={formatCurrency(totalSalesVal)}
          change={totalSalesVal > 0 ? 12 : 0}
          trend={totalSalesVal > 0 ? "up" : "down"}
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatCard
          title="Orders"
          value={totalOrders.toString()}
          change={totalOrders > 0 ? 8 : 0}
          trend={totalOrders > 0 ? "up" : "down"}
          icon={<ShoppingCart className="w-6 h-6" />}
        />
        <StatCard
          className="md:col-span-2 lg:col-span-1"
          title="Avg Order Value"
          value={formatCurrency(avgOrderVal)}
          change={avgOrderVal > 0 ? 5 : 0}
          trend={avgOrderVal > 0 ? "up" : "down"}
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

      <FilterBar
        onSearch={setSearchQuery}
        searchPlaceholder="Search orders..."
      />

      <DataTable
        title="Recent Orders"
        columns={[
          { key: "id", label: "Order ID" },
          { key: "date", label: "Date" },
          { key: "customer", label: "Customer" },
          { key: "amount", label: "Amount" },
          { key: "status", label: "Status" },
        ]}
        data={filteredData}
      />
    </div>
  );
}
