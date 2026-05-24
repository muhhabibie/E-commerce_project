"use client";

import {
  BarChart3,
  ShoppingCart,
  Package,
  TrendingUp,
  ItalicIcon as AnalyticsIcon,
  Settings,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type PageId = "overview" | "pos" | "inventory" | "sales" | "analytics" | "chat";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: PageId) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const menuItems: Array<{ id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "pos", label: "POS", icon: ShoppingCart },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "sales", label: "Sales", icon: TrendingUp },
    { id: "analytics", label: "Analytics", icon: AnalyticsIcon },
    { id: "chat", label: "Pesan", icon: MessageCircle },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h1 className="text-2xl font-bold text-foreground">Merchant</h1>
        <p className="text-sm text-muted-foreground">Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <Button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              variant={isActive ? "default" : "link"}
              className={`w-full justify-start gap-3 ${
                isActive
                  ? "bg-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-primary"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Settings</span>
        </Button>
      </div>
    </aside>
  );
}
