import { ProductTypeContentType } from "@/content/content";
import DisplayProductTypeItem from "./display-product-type-item";
import DisplayMerchant from "./display-merchant";
import PromoProduct from "./promo-product";
import InspiratedItem from "./inspirated-item";
import { DisplayMerchantResponse } from "@/types";
import LocationBadge from "./location-badge";
import { Skeleton } from "../ui/skeleton";
import { Card, CardContent, CardHeader } from "../ui/card";
import type { Article } from "@/content/articles";

interface ProductSectionProps {
  title?: string;
  description?: string;
  products?: ProductTypeContentType[];
  isExplore?: boolean;
  isPromo?: boolean;
  isInspirated?: boolean;
  displayMerchant?: DisplayMerchantResponse;
  isLoading?: boolean;
  articles?: Article[];
}

const ProductSection = ({
  title,
  description,
  products,
  isExplore,
  isPromo,
  isInspirated,
  displayMerchant,
  isLoading,
  articles = [],
}: ProductSectionProps) => {
  const safeDisplayMerchant = Array.isArray(displayMerchant?.data)
    ? displayMerchant.data
    : [];

  return (
    <>
      <div className="space-y-2 md:space-y-3 mt-8 md:mt-12 lg:mt-15 mb-5 md:mb-6 lg:mb-7.5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h1
            className={`text-xl md:text-2xl lg:text-3xl font-extrabold leading-tight ${
              isPromo ? "text-white" : "text-secondary"
            }`}
          >
            {title}
          </h1>
          {isExplore && <LocationBadge />}
        </div>
        <p
          className={`text-sm md:text-base lg:text-lg xl:text-[22px] leading-relaxed ${
            isPromo ? "text-white" : "text-[#606060]"
          }`}
        >
          {description}
        </p>
      </div>

      {isInspirated && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6">
          {articles.map((article) => (
            <InspiratedItem key={article.id} article={article} />
          ))}
        </div>
      )}

      {!isInspirated && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {/* Loading Skeleton for Explore */}
          {isExplore && isLoading && (
            <>
              {Array.from({ length: 8 }).map((_, idx) => (
                <Card key={idx} className="p-0 rounded-[20px] overflow-hidden">
                  <CardHeader className="!p-0 relative overflow-hidden w-full h-[140px] md:h-[180px] lg:h-[220px]">
                    <Skeleton className="w-full h-full" />
                  </CardHeader>
                  <CardContent className="px-3 pb-3 md:px-4 md:pb-4 -mt-5 space-y-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </>
          )}

          {/* Loaded Explore Data */}
          {isExplore &&
            !isLoading &&
            safeDisplayMerchant.map((item, idx) => (
              <DisplayMerchant
                key={idx}
                displayMerchant={item}
                isLoading={isLoading}
              />
            ))}

          {/* Loading Skeleton for Promo */}
          {isPromo && isLoading && (
            <>
              {Array.from({ length: 8 }).map((_, idx) => (
                <Card
                  key={idx}
                  className="p-0 rounded-[20px] overflow-hidden flex flex-col h-full"
                >
                  <CardHeader className="p-0 relative overflow-hidden h-[120px] md:h-[150px] lg:h-[180px]">
                    <Skeleton className="w-full h-full" />
                  </CardHeader>
                  <CardContent className="px-3 py-2.5 md:px-4 md:py-3 flex-1 flex flex-col gap-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="space-y-1 mt-auto">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-5 w-2/3" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </CardContent>
                  <div className="pb-2.5 md:pb-3 px-3 md:px-4">
                    <Skeleton className="h-10 w-full rounded-2xl" />
                  </div>
                </Card>
              ))}
            </>
          )}

          {/* Loaded Promo Data */}
          {isPromo &&
            !isLoading &&
            safeDisplayMerchant.map((item, idx) => (
              <PromoProduct key={idx} merchant={item} />
            ))}

          {!isExplore &&
            !isPromo &&
            products?.map((item, idx) => (
              <DisplayProductTypeItem key={idx} {...item} />
            ))}
        </div>
      )}
    </>
  );
};

export default ProductSection;
