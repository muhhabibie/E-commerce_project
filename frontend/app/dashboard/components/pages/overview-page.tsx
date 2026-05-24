"use client"

import { useState } from "react"
import { StatCard } from "@/app/dashboard/components/dashboard/stat-card"
import { RevenueChart } from "@/app/dashboard/components/dashboard/revenue-chart"
import { CategoryDonutChart } from "@/app/dashboard/components/dashboard/category-donut-chart"
import { DateRangePicker } from "@/app/dashboard/components/dashboard/date-range-picker"
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react"

const mockRevenueData = [
  { date: "Jan 1", revenue: 4000 },
  { date: "Jan 5", revenue: 3000 },
  { date: "Jan 10", revenue: 2000 },
  { date: "Jan 15", revenue: 2780 },
  { date: "Jan 20", revenue: 1890 },
  { date: "Jan 25", revenue: 2390 },
  { date: "Jan 30", revenue: 3490 },
]

const mockCategoryData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Food", value: 20 },
  { name: "Books", value: 15 },
  { name: "Other", value: 5 },
]

export function OverviewPage() {
  const [, setDateRange] = useState({ start: "", end: "" })

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Overview</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">Welcome back! Here&apos;s your business summary.</p>
        </div>
        <DateRangePicker onDateChange={(start, end) => setDateRange({ start, end })} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          title="Total Revenue"
          value="Rp 45.2M"
          change={12}
          trend="up"
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatCard
          title="Total Orders"
          value="1,234"
          change={8}
          trend="up"
          icon={<ShoppingCart className="w-6 h-6" />}
        />
        <StatCard title="Total Products" value="456" change={-2} trend="down" icon={<Package className="w-6 h-6" />} />
        <StatCard title="Growth Rate" value="23.5%" change={5} trend="up" icon={<TrendingUp className="w-6 h-6" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={mockRevenueData} />
        </div>
        <CategoryDonutChart data={mockCategoryData} />
      </div>
    </div>
  )
}
