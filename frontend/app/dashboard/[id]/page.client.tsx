"use client";

import { Sidebar } from "@/app/dashboard/components/dashboard/sidebar";
import useChangePage from "@/hooks/dashboard/use-change-page";
import { OverviewPage } from "../components/pages/overview-page";
import { POSPage } from "../components/pages/pos-page";
import { InventoryPage } from "../components/pages/inventory-page";
import { SalesPage } from "../components/pages/sales-page";
import { AnalyticsPage } from "../components/pages/analytics-page";
import { ChatPage } from "../components/pages/chat-page";
import useHandleSidebar from "@/hooks/dashboard/use-handle-sidebar";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";

export default function DashboardClient({
  merchantId,
}: {
  merchantId: string;
}) {
  const { activePage, handlePage } = useChangePage();
  const { isSidebarOpen, toggleSidebar } = useHandleSidebar();
  const { merchant } = useGetMerchantById(merchantId);

  let content;

  if (activePage === "overview") {
    content = <OverviewPage merchant={merchant} />;
  } else if (activePage === "pos") {
    content = <POSPage />;
  } else if (activePage === "inventory") {
    content = <InventoryPage merchant={merchant} />;
  } else if (activePage === "sales") {
    content = <SalesPage merchant={merchant} />;
  } else if (activePage === "analytics") {
    content = <AnalyticsPage />;
  } else if (activePage === "chat") {
    content = <ChatPage merchantUserId={merchant?.user_id ?? ""} />;
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar currentPage={activePage} onPageChange={handlePage} />
      </div>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => toggleSidebar()}
        />
      )}

      <div
        className={`fixed left-0 top-0 h-screen w-64 z-50 md:hidden transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          currentPage={activePage}
          onPageChange={(page) => {
            handlePage(page);
            toggleSidebar();
          }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="md:hidden flex items-center justify-between bg-card border-b border-border p-4">
          <Button variant="ghost" size="icon" onClick={() => toggleSidebar()}>
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
          <h1 className="text-lg font-bold text-foreground">
            Merchant Dashboard
          </h1>
          <div className="w-10" />
        </div>
        <div className="flex-1 overflow-auto">{content}</div>
      </main>
    </div>
  );
}
