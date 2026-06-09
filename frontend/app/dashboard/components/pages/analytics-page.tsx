"use client"

import { useState } from "react"
import { RevenueChart } from "@/app/dashboard/components/dashboard/revenue-chart"
import { CategoryDonutChart } from "@/app/dashboard/components/dashboard/category-donut-chart"
import { DateRangePicker } from "@/app/dashboard/components/dashboard/date-range-picker"
import { StatCard } from "@/app/dashboard/components/dashboard/stat-card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, ShoppingCart } from "lucide-react"
import { Merchant } from "@/types"

interface AnalyticsPageProps {
  merchant?: Merchant | null
}

export function AnalyticsPage({ merchant }: AnalyticsPageProps) {
  const [, setDateRange] = useState({ start: "", end: "" })

  const sales = Array.isArray(merchant?.selledStocks) ? merchant.selledStocks : []
  const stocks = Array.isArray(merchant?.stocks) ? merchant.stocks : []

  // Filter out cancelled transactions
  const activeSales = sales.filter((s: any) => s.status !== "cancelled")

  // Calculate main stats
  const totalRevenue = activeSales.reduce((sum: number, s: any) => sum + s.total_price, 0)
  const totalOrders = activeSales.length
  
  // Calculate unique buyers (customers)
  const uniqueUsers = new Set(activeSales.map((s: any) => s.user_id))
  const totalCustomers = uniqueUsers.size

  // Format currency helper
  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)} Jt`
    }
    return `Rp ${value.toLocaleString("id-ID")}`
  }

  // 1. Group revenue by date for Revenue Chart (chronological sorting)
  const revenueByDate: { [key: string]: number } = {}
  activeSales.forEach((s: any) => {
    const dateStr = new Date(s.created_at).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    })
    revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + s.total_price
  })

  const chartData = Object.keys(revenueByDate).map((date) => ({
    date,
    revenue: revenueByDate[date],
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const displayRevenueData = chartData.length > 0 ? chartData : [
    { date: "Hari ini", revenue: 0 }
  ]

  // 2. Group sales by product for Donut Chart
  const productSalesMap: { [name: string]: number } = {}
  activeSales.forEach((s: any) => {
    const matchedProduct = stocks.find((p) => p.id === s.stock_id)
    const productName = matchedProduct?.name || "Produk Terhapus"
    productSalesMap[productName] = (productSalesMap[productName] || 0) + s.quantity
  })

  const productSalesData = Object.keys(productSalesMap).map((name) => ({
    name: name.length > 15 ? name.substring(0, 15) + "..." : name,
    value: productSalesMap[name],
  })).sort((a, b) => b.value - a.value).slice(0, 5)

  const displayCategoryData = productSalesData.length > 0 ? productSalesData : [
    { name: "Belum Ada Penjualan", value: 1 }
  ]

  // 3. Group sales & orders by month dynamically for last 6 months
  const monthlyData: { [month: string]: { sales: number; orders: number } } = {}
  const last6Months: string[] = []
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthName = d.toLocaleDateString("id-ID", { month: "short" })
    monthlyData[monthName] = { sales: 0, orders: 0 }
    last6Months.push(monthName)
  }

  activeSales.forEach((s: any) => {
    const monthName = new Date(s.created_at).toLocaleDateString("id-ID", { month: "short" })
    if (monthlyData[monthName] !== undefined) {
      monthlyData[monthName].sales += s.total_price
      monthlyData[monthName].orders += s.quantity
    }
  })

  const salesChartData = last6Months.map((month) => ({
    month,
    sales: monthlyData[month].sales,
    orders: monthlyData[month].orders,
  }))

  // Calculate dynamic growth metrics
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const salesLastWeek = activeSales
    .filter((s: any) => new Date(s.created_at) >= oneWeekAgo)
    .reduce((sum: number, s: any) => sum + s.total_price, 0)
  const salesBefore = totalRevenue - salesLastWeek

  let growthRate = 0
  if (salesBefore > 0) {
    growthRate = Math.round((salesLastWeek / salesBefore) * 100)
  } else if (salesLastWeek > 0) {
    growthRate = 100
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
          value={formatRevenue(totalRevenue)}
          change={growthRate > 0 ? growthRate : 0}
          trend={growthRate > 0 ? "up" : "down"}
          icon={<TrendingUp className="w-6 h-6" />}
        />
        <StatCard 
          title="Total Customers" 
          value={totalCustomers.toLocaleString("id-ID")} 
          change={totalCustomers > 0 ? 5 : 0} 
          trend={totalCustomers > 0 ? "up" : "down"} 
          icon={<Users className="w-6 h-6" />} 
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString("id-ID")}
          change={totalOrders > 0 ? 10 : 0}
          trend={totalOrders > 0 ? "up" : "down"}
          icon={<ShoppingCart className="w-6 h-6" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={displayRevenueData} title="Revenue Trend" />
        <CategoryDonutChart data={displayCategoryData} title="Sales by Top Products" />
      </div>

      {/* Sales by Month */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sales & Orders by Month</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
                formatter={(value: any, name: string) => {
                  if (name === "sales") {
                    return [`Rp ${value.toLocaleString("id-ID")}`, "Omset Penjualan"]
                  }
                  return [`${value} Pcs`, "Produk Terjual"]
                }}
              />
              <Legend formatter={(value) => (value === "sales" ? "Omset Penjualan (Rp)" : "Volume Produk Terjual (Pcs)")} />
              <Bar dataKey="sales" fill="var(--chart-1)" />
              <Bar dataKey="orders" fill="var(--chart-2)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
