"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useRouter } from "next/navigation";
import Clock from "../icons/clock-icon";
import RightArrow from "../icons/right-arrow";
import type { Article } from "@/content/articles";

interface InspiratedItemProps {
  article: Article;
}

import { playHapticFeedback } from "@/lib/haptic";

const InspiratedItem = ({ article }: InspiratedItemProps) => {
  const router = useRouter();

  const handleToArticle = () => {
    playHapticFeedback("medium");
    router.push(`/article/${article.slug}`);
  };

  return (
    <Card
      className="p-0 rounded-[20px] overflow-hidden group hover:shadow-xl hover:-translate-y-1.5 active:translate-y-[1px] active:scale-[0.98] border hover:border-primary/20 transition-all duration-200 ease-out cursor-pointer"
      onClick={handleToArticle}
    >
      <CardHeader className="!p-0 relative overflow-hidden w-full h-[160px] md:h-[180px] lg:h-[200px]">
        <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
          <span className="bg-primary text-white text-[10px] md:text-xs font-semibold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full">
            {article.category}
          </span>
        </div>
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="w-full h-full object-cover overflow-hidden group-hover:scale-110 transition-all duration-500"
        />
      </CardHeader>
      <CardContent className="p-4 md:p-5 lg:p-6 space-y-3 md:space-y-4">
        <h1 className="text-[#606060] text-sm md:text-base lg:text-lg xl:text-[22px] font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {article.title}
        </h1>
        <p className="text-xs md:text-sm lg:text-base xl:text-lg font-medium text-[#8D8D8D] line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 md:justify-between md:items-center pt-2 md:pt-3">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4" />
            <p className="text-xs md:text-sm lg:text-base text-[#8D8D8D]">
              {article.readTime}
            </p>
          </div>
          <div className="flex items-center cursor-pointer gap-1.5 md:gap-2 group/link hover:gap-2.5 transition-all duration-200">
            <p className="text-primary text-xs md:text-sm lg:text-base font-medium">
              Baca Selengkapnya
            </p>
            <RightArrow className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary group-hover/link:translate-x-0.5 transition-transform duration-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InspiratedItem;
