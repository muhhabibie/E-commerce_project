"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Heart } from "lucide-react";
import useClickLike from "@/hooks/landing-page/use-click-like";
import RatingStar from "../icons/rating-star";
import { DisplayMerchantType } from "@/types";
import { useRouter } from "next/navigation";

interface displayMerchantProps {
  displayMerchant?: DisplayMerchantType;
  isLoading?: boolean;
}

import { playHapticFeedback } from "@/lib/haptic";

const DisplayMerchant = ({
  displayMerchant,
  isLoading,
}: displayMerchantProps) => {
  const router = useRouter();
  const { isLiked, toggleLike } = useClickLike();
  
  const handleToMerchant = (id: string) => {
    playHapticFeedback("medium");
    router.push(`/merchant/${id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playHapticFeedback(isLiked ? "light" : "success");
    toggleLike();
  };

  // Generate dynamic but deterministic values based on ID if real data is absent
  const idNum = displayMerchant?.id ? parseInt(displayMerchant.id.slice(-4), 16) : 0;
  const displayDistance = displayMerchant?.id ? (idNum % 15 + 1).toFixed(1) + " km" : "1.20 km";
  const timeBase = displayMerchant?.id ? (idNum % 20 + 5) : 10;
  const displayTime = `${timeBase}-${timeBase + 10} menit`;

  // Ratings calculation
  const hasRatings = displayMerchant?.ratings && displayMerchant.ratings.length > 0;
  const displayRating = hasRatings 
    ? (displayMerchant.ratings!.reduce((a, b) => a + b.rate, 0) / displayMerchant.ratings!.length).toFixed(1) 
    : null;
  const displayReviewCount = hasRatings ? displayMerchant.ratings!.length : 0;

  // Generate price
  let displayPrice = displayMerchant?.minPrice;
  if (!displayPrice && displayMerchant?.stocks && displayMerchant.stocks.length > 0) {
    displayPrice = Math.min(...displayMerchant.stocks.map((s) => s.price));
  }
  if (!displayPrice) {
    displayPrice = Math.floor(Math.random() * 30000) + 10000; // fallback
  }

  return (
    <Card
      className="p-0 rounded-[20px] overflow-hidden group hover:shadow-xl hover:-translate-y-1.5 active:translate-y-[1px] active:scale-[0.98] border hover:border-primary/20 transition-all duration-200 ease-out cursor-pointer bg-white"
      onClick={() => handleToMerchant(displayMerchant?.id as string)}
    >
      <CardHeader className="!p-0 relative overflow-hidden w-full h-[140px] md:h-[180px] lg:h-[220px]">
        <div
          className={`size-8 md:size-9 lg:size-10 absolute top-2 md:top-3 right-2 md:right-3 ${
            isLiked ? "bg-primary" : "bg-[#FFD6A7]"
          } rounded-full flex items-center justify-center z-50 transition-all duration-100 active:scale-75 hover:scale-110 ease-out`}
          onClick={handleLike}
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 transition duration-300 ${
              isLiked ? "text-[#FFD6A7] fill-current" : "text-primary"
            }`}
          />
        </div>
        <Image
          src={displayMerchant?.profilePhotoUrl || "/images/profile-img.png"}
          alt="Toko"
          fill
          className="bg-contain overflow-hidden group-hover:scale-[117%] transition-all duration-500"
        />
      </CardHeader>
      <CardContent className="px-3 pb-3 md:px-4 md:pb-4 -mt-5">
        <div className="text-[#8D8D8D] flex items-center gap-1.5 md:gap-2">
          <p className="text-[10px] md:text-xs lg:text-base">{displayDistance}</p>
          <p className="text-base md:text-xl lg:text-2xl">•</p>
          <p className="text-[10px] md:text-xs lg:text-base">{displayTime}</p>
        </div>
        <div className="space-y-2 md:space-y-3">
          <p className="text-base md:text-lg lg:text-xl xl:text-2xl font-semibold text-secondary line-clamp-1">
            {displayMerchant?.name}
          </p>
 
          <div>
            <div className="flex items-center text-[#606060]">
              {displayRating !== null ? (
                <>
                  <span className="size-[24px] md:size-[28px] lg:size-[30px] relative flex items-center justify-center">
                    <RatingStar className="size-[14px] md:size-[16px] lg:size-[18px] text-[#F8C600]" />
                  </span>
                  <p className="ml-1.5 md:ml-2 text-[10px] md:text-xs lg:text-base font-semibold">
                    {displayRating}{" "}
                  </p>
                  <p className="ml-2 md:ml-3 text-[10px] md:text-xs lg:text-base text-gray-400">
                    ({displayReviewCount}) Ulasan
                  </p>
                </>
              ) : (
                <p className="text-[10px] md:text-xs lg:text-sm text-gray-400 font-medium italic py-1">
                  Belum ada ulasan
                </p>
              )}
            </div>
            <p className="text-primary text-xs md:text-sm lg:text-base xl:text-lg font-bold mt-2 md:mt-3">
              Mulai dari Rp. {displayPrice.toLocaleString("id-ID")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayMerchant;
