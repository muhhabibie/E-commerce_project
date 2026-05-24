"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TabsProduct from "./tabs-products";
import TabsAbout from "./tabs-about";
import TabsReview from "./tabs-review";
import React from "react";
import Box from "@/components/icons/box";
import Store from "@/components/icons/store";
import Star from "@/components/icons/star";
import AsideCard from "./aside-card";
import CartCard from "./cart-card";
import { Merchant } from "@/types";
import type { CartItem } from "@/hooks/merchant/use-add-product-to-cart";

type TabConfig = {
  value: string;
  text: string;
  icon: React.ReactElement;
};

const tabsConfig: TabConfig[] = [
  { value: "products", text: "Produk", icon: <Box /> },
  { value: "abouts", text: "Tentang", icon: <Store /> },
  { value: "reviews", text: "Ulasan", icon: <Star /> },
];
interface TabsDisplayProps {
  merchant?: Merchant | null;
  handleProduct: (productId: string) => void;
  cart: CartItem[];
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  totals: { totalQty: number; totalPrice: number };
}

const TabsDisplay = ({
  merchant,
  handleProduct,
  cart,
  increment,
  decrement,
  totals,
}: TabsDisplayProps) => {
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      <Tabs defaultValue="products" className="col-span-1 lg:col-span-2">
        <TabsList className="grid w-full grid-cols-3 gap-1 md:gap-1.5 p-1 md:p-1.5 bg-[#F9F9F9] rounded-xl md:rounded-2xl h-auto">
          {tabsConfig.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="
          flex w-full items-center justify-center gap-1.5 md:gap-2 px-2 py-2 md:px-3 md:py-2.5 lg:px-4 lg:py-3
          text-[10px] md:text-xs lg:text-sm xl:text-base font-medium
          text-[#808080] rounded-lg md:rounded-xl
          data-[state=active]:text-primary
          data-[state=active]:bg-white
          data-[state=active]:shadow-sm
          transition-all
          h-auto
              "
            >
              {tab.icon}
              <span>{tab.text}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4 md:mt-6 lg:mt-8">
          <TabsProduct
            product={merchant?.stocks}
            handleProduct={handleProduct}
          />
          <TabsAbout maps={merchant?.iframe_map_url} />
          <TabsReview ratings={merchant?.ratings} />
        </div>
      </Tabs>
      <div className="flex flex-col gap-3 md:gap-4 col-span-1 lg:col-span-1 mt-4 md:mt-6 lg:mt-0">
        <AsideCard className="w-full" location={merchant?.location} merchantId={merchant?.id ?? ""} />
        <CartCard
          className="w-full"
          cart={cart}
          increment={increment}
          decrement={decrement}
          totals={totals}
        />
      </div>
    </div>
  );
};

export default TabsDisplay;
