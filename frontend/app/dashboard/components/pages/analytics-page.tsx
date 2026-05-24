"use client"

import { useState } from "react"
import { RevenueChart } from "@/app/dashboard/components/dashboard/revenue-chart"
import { CategoryDonutChart } from "@/app/dashboard/components/dashboard/category-donut-chart"
import { DateRangePicker } from "@/app/dashboard/components/dashboard/date-range-picker"
import { StatCard } from "@/app/dashboard/components/dashboard/stat-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, ShoppingCart } from "lucide-react"

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

const mockSalesData = [
  { month: "Jan", sales: 4000, orders: 240 },
  { month: "Feb", sales: 3000, orders: 221 },
  { month: "Mar", sales: 2000, orders: 229 },
  { month: "Apr", sales: 2780, orders: 200 },
  { month: "May", sales: 1890, orders: 229 },
  { month: "Jun", sales: 2390, orders: 200 },
]

export function AnalyticsPage() {
  const [, setDateRange] = useState({ start: "", end: "" })

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed insights into your business performance</p>
        </div>
        <DateRangePicker onDateChange={(start, end) => setDateRange({ start, end })} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Total Revenue"
          value="Rp 45.2M"
          change={12}
          trend="up"
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <StatCard title="Total Customers" value="1,234" change={8} trend="up" icon={<Users className="w-6 h-6" />} />
        <StatCard
          title="Total Orders"
          value="5,678"
          change={15}
          trend="up"
          icon={<ShoppingCart className="w-6 h-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={mockRevenueData} title="Revenue Trend" />
        <CategoryDonutChart data={mockCategoryData} title="Sales by Category" />
      </div>

      {/* Sales by Month */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sales & Orders by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar dataKey="sales" fill="var(--chart-1)" />
              <Bar dataKey="orders" fill="var(--chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
