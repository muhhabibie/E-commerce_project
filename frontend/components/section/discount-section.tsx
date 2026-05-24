"use client";

import { DisplayMerchantResponse } from "@/types";
import PageContainer from "../shared/page-container";
import ProductSection from "../shared/product-section";
import Section from "../shared/section";

interface DiscountSectionProps {
  displayMerchant?: DisplayMerchantResponse;
  displayMerchantLoading?: boolean;
}

const DiscountSection = ({
  displayMerchant,
  displayMerchantLoading,
}: DiscountSectionProps) => {
  return (
    <Section className="relative w-full mt-12 md:mt-16 lg:mt-20 overflow-visible">
      {/* Full background */}
      <div
        className="
          absolute inset-0 
          h-[240px] md:h-[280px] lg:h-[302px] w-full 
          bg-[url('/images/gradient-menu.png')] 
          bg-cover bg-no-repeat bg-center
          rounded-[15px] md:rounded-[20px]
        "
        aria-hidden
      />

      {/* Konten */}
      <PageContainer className="relative z-10 pt-6 pb-6 md:pt-8 md:pb-8 lg:pt-10 lg:pb-8">
        <div className="text-center">
          <ProductSection
            title="Promo Spesial Buat Kamu"
            description="Belanja hemat sambil dukung UMKM lokal? Bisa banget!"
            isPromo
            displayMerchant={displayMerchant}
            isLoading={displayMerchantLoading}
          />
        </div>
      </PageContainer>
    </Section>
  );
};

export default DiscountSection;
