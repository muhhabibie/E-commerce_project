"use client"

import { useState } from "react"
import { StatCard } from "@/app/dashboard/components/dashboard/stat-card"
import { RevenueChart } from "@/app/dashboard/components/dashboard/revenue-chart"
import { CategoryDonutChart } from "@/app/dashboard/components/dashboard/category-donut-chart"
import { DateRangePicker } from "@/app/dashboard/components/dashboard/date-range-picker"
import { DollarSign, ShoppingCart, Package, TrendingUp } from "lucide-react"
import { Merchant } from "@/types"

interface OverviewPageProps {
  merchant?: Merchant | null;
}

export function OverviewPage({ merchant }: OverviewPageProps) {
  const [, setDateRange] = useState({ start: "", end: "" })

  const sales = Array.isArray(merchant?.selledStocks) ? merchant.selledStocks : [];
  const stocks = Array.isArray(merchant?.stocks) ? merchant.stocks : [];

  // Filter out cancelled transactions
  const activeSales = sales.filter((s: any) => s.status !== "cancelled");

  // Calculate stats
  const totalRevenue = activeSales.reduce((sum: number, s: any) => sum + s.total_price, 0);
  const totalOrders = activeSales.length;
  const totalProducts = stocks.length;

  // Group revenue by date for chart (chronological sorting)
  const revenueByDate: { [key: string]: number } = {};
  activeSales.forEach((s: any) => {
    const dateStr = new Date(s.created_at).toLocaleDateString("id-ID", {
      month: "short",
      day: "numeric",
    });
    revenueByDate[dateStr] = (revenueByDate[dateStr] || 0) + s.total_price;
  });

  const chartData = Object.keys(revenueByDate).map((date) => ({
    date,
    revenue: revenueByDate[date],
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const displayChartData = chartData.length > 0 ? chartData : [
    { date: "Hari ini", revenue: 0 }
  ];

  // Group products by name for donut chart distribution
  const productDistribution = stocks.slice(0, 5).map((p: any) => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + "..." : p.name,
    value: p.quantity,
  }));

  const displayCategoryData = productDistribution.length > 0 ? productDistribution : [
    { name: "Belum Ada Produk", value: 1 }
  ];

  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)} Jt`;
    }
    return `Rp ${value.toLocaleString("id-ID")}`;
  };

  // Calculate dynamic growth: last 7 days vs previous
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const salesLastWeek = activeSales
    .filter((s: any) => new Date(s.created_at) >= oneWeekAgo)
    .reduce((sum: number, s: any) => sum + s.total_price, 0);
  const salesBefore = totalRevenue - salesLastWeek;
  
  let growthRate = 0;
  if (salesBefore > 0) {
    growthRate = Number(((salesLastWeek / salesBefore) * 100).toFixed(1));
  } else if (salesLastWeek > 0) {
    growthRate = 100;
  }

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
          value={formatRevenue(totalRevenue)}
          change={growthRate > 0 ? 12 : 0}
          trend={growthRate > 0 ? "up" : "down"}
          icon={<DollarSign className="w-6 h-6" />}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toLocaleString("id-ID")}
          change={activeSales.length > 0 ? 8 : 0}
          trend={activeSales.length > 0 ? "up" : "down"}
          icon={<ShoppingCart className="w-6 h-6" />}
        />
        <StatCard 
          title="Total Products" 
          value={totalProducts.toLocaleString("id-ID")} 
          change={stocks.length > 0 ? 2 : 0} 
          trend={stocks.length > 0 ? "up" : "down"} 
          icon={<Package className="w-6 h-6" />} 
        />
        <StatCard 
          title="Growth Rate" 
          value={`${growthRate}%`} 
          change={growthRate > 0 ? 5 : 0} 
          trend={growthRate > 0 ? "up" : "down"} 
          icon={<TrendingUp className="w-6 h-6" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={displayChartData} />
        </div>
        <CategoryDonutChart data={displayCategoryData} />
      </div>
    </div>
  )
}
