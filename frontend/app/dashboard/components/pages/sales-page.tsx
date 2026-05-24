"use client";

import { useState } from "react";
import { DataTable } from "@/app/dashboard/components/dashboard/data-table";
import { FilterBar } from "@/app/dashboard/components/dashboard/filter-bar";
import { DateRangePicker } from "@/app/dashboard/components/dashboard/date-range-picker";
import { StatCard } from "@/app/dashboard/components/dashboard/stat-card";
import { ShoppingCart, TrendingUp, DollarSign } from "lucide-react";

const mockSalesData = [
  {
    id: "ORD-001",
    date: "2024-01-15",
    customer: "John Doe",
    amount: "Rp 5.2M",
    status: "Completed",
  },
  {
    id: "ORD-002",
    date: "2024-01-14",
    customer: "Jane Smith",
    amount: "Rp 3.8M",
    status: "Completed",
  },
  {
    id: "ORD-003",
    date: "2024-01-13",
    customer: "Bob Johnson",
    amount: "Rp 2.1M",
    status: "Pending",
  },
  {
    id: "ORD-004",
    date: "2024-01-12",
    customer: "Alice Brown",
    amount: "Rp 7.5M",
    status: "Completed",
  },
  {
    id: "ORD-005",
    date: "2024-01-11",
    customer: "Charlie Wilson",
    amount: "Rp 4.3M",
    status: "Completed",
  },
];

export function SalesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setDateRange] = useState({ start: "", end: "" });

  const filteredData = mockSalesData.filter(
    (item) =>
      item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          value="Rp 22.9M"
          change={15}
          trend="up"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatCard
          title="Orders"
          value="5"
          change={3}
          trend="up"
          icon={<ShoppingCart className="w-6 h-6" />}
        />
        <StatCard
          className="md:col-span-2 lg:col-span-1"
          title="Avg Order Value"
          value="Rp 4.58M"
          change={8}
          trend="up"
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
