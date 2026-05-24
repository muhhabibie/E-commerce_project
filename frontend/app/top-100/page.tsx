"use client";

import { useState } from "react";
import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import useGetDisplayMerchant from "@/hooks/merchant/use-get-display-merchant";
import DisplayMerchant from "@/components/shared/display-merchant";
import { Trophy, TrendingUp, Star, Award, Crown, Medal } from "lucide-react";
import { Merchant } from "@/types";

const Top100Page = () => {
  const { openModal } = useOpenModal();
  const { displayMerchant, isLoading } = useGetDisplayMerchant();
  const [selectedTab, setSelectedTab] = useState<
    "overall" | "monthly" | "weekly"
  >("overall");

  const safeDisplayMerchant = Array.isArray(displayMerchant?.data)
    ? displayMerchant.data
    : [];

  // Mock ranking data - in real app, this would come from API
  const rankedMerchants = safeDisplayMerchant.map(
    (merchant: Merchant, idx: number) => ({
      ...merchant,
      rank: idx + 1,
      score: 1000 - idx * 10,
      totalTransactions: Math.floor(Math.random() * 1000) + 100,
      rating: (4 + Math.random()).toFixed(1),
      growth: (Math.random() * 50).toFixed(1),
    })
  );

  const getTopBadge = (rank: number) => {
    if (rank === 1)
      return {
        icon: <Crown className="w-5 h-5 md:w-6 md:h-6" />,
        color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
        text: "text-yellow-600",
        label: "🥇 Juara 1",
      };
    if (rank === 2)
      return {
        icon: <Medal className="w-5 h-5 md:w-6 md:h-6" />,
        color: "bg-gradient-to-r from-gray-300 to-gray-500",
        text: "text-gray-600",
        label: "🥈 Juara 2",
      };
    if (rank === 3)
      return {
        icon: <Award className="w-5 h-5 md:w-6 md:h-6" />,
        color: "bg-gradient-to-r from-orange-400 to-orange-600",
        text: "text-orange-600",
        label: "🥉 Juara 3",
      };
    return null;
  };

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-6 md:mt-8 lg:mt-10 min-h-screen pb-10">
        <PageContainer>
          {/* Hero Section */}
          <div className="mb-8 md:mb-10 lg:mb-12 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-sm md:text-base font-semibold text-primary">
                Top 100 UMKM Terbaik
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#333] mb-3 md:mb-4">
              Peringkat UMKM Terpopuler
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D] leading-relaxed max-w-3xl mx-auto">
              UMKM dengan performa terbaik berdasarkan transaksi, rating, dan
              pertumbuhan. Mari dukung UMKM favorit kamu!
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="inline-flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
              <button
                onClick={() => setSelectedTab("overall")}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-sm md:text-base font-semibold transition-all ${
                  selectedTab === "overall"
                    ? "bg-white text-primary shadow-sm"
                    : "text-[#8D8D8D] hover:text-[#333]"
                }`}
              >
                Overall
              </button>
              <button
                onClick={() => setSelectedTab("monthly")}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-sm md:text-base font-semibold transition-all ${
                  selectedTab === "monthly"
                    ? "bg-white text-primary shadow-sm"
                    : "text-[#8D8D8D] hover:text-[#333]"
                }`}
              >
                Bulan Ini
              </button>
              <button
                onClick={() => setSelectedTab("weekly")}
                className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-sm md:text-base font-semibold transition-all ${
                  selectedTab === "weekly"
                    ? "bg-white text-primary shadow-sm"
                    : "text-[#8D8D8D] hover:text-[#333]"
                }`}
              >
                Minggu Ini
              </button>
            </div>
          </div>

          {/* Top 3 Podium */}
          {!isLoading && rankedMerchants.length >= 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
              {/* 2nd Place */}
              <div className="md:order-1 order-2">
                <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-all border-2 border-gray-200">
                  <CardContent className="p-5 md:p-6 text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-r from-gray-300 to-gray-500 flex items-center justify-center mb-3">
                        <span className="text-3xl md:text-4xl font-extrabold text-white">
                          2
                        </span>
                      </div>
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-500 text-white border-0">
                        🥈 Juara 2
                      </Badge>
                    </div>
                    <DisplayMerchant
                      displayMerchant={rankedMerchants[1]}
                      isLoading={false}
                    />
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-[#8D8D8D]">Score:</span>
                        <span className="font-bold text-gray-600">
                          {rankedMerchants[1].score}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-[#8D8D8D]">Rating:</span>
                        <span className="font-bold flex items-center gap-1">
                          ⭐ {rankedMerchants[1].rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 1st Place */}
              <div className="md:order-2 order-1">
                <Card className="rounded-3xl shadow-2xl hover:shadow-3xl transition-all border-4 border-yellow-400 md:scale-105">
                  <CardContent className="p-5 md:p-6 text-center">
                    <div className="relative mb-4">
                      <div className="w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center mb-3 animate-pulse">
                        <Crown className="w-10 h-10 md:w-12 md:h-12 text-white" />
                      </div>
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-white border-0">
                        🥇 Juara 1
                      </Badge>
                    </div>
                    <DisplayMerchant
                      displayMerchant={rankedMerchants[0]}
                      isLoading={false}
                    />
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-[#8D8D8D]">Score:</span>
                        <span className="font-bold text-yellow-600">
                          {rankedMerchants[0].score}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-[#8D8D8D]">Rating:</span>
                        <span className="font-bold flex items-center gap-1">
                          ⭐ {rankedMerchants[0].rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 3rd Place */}
              <div className="md:order-3 order-3">
                <Card className="rounded-3xl shadow-lg hover:shadow-xl transition-all border-2 border-orange-200">
                  <CardContent className="p-5 md:p-6 text-center">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-r from-orange-400 to-orange-600 flex items-center justify-center mb-3">
                        <span className="text-3xl md:text-4xl font-extrabold text-white">
                          3
                        </span>
                      </div>
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-orange-500 text-white border-0">
                        🥉 Juara 3
                      </Badge>
                    </div>
                    <DisplayMerchant
                      displayMerchant={rankedMerchants[2]}
                      isLoading={false}
                    />
                    <div className="mt-4 pt-4 border-t space-y-2">
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-[#8D8D8D]">Score:</span>
                        <span className="font-bold text-orange-600">
                          {rankedMerchants[2].score}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-[#8D8D8D]">Rating:</span>
                        <span className="font-bold flex items-center gap-1">
                          ⭐ {rankedMerchants[2].rating}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Ranking List (4-100) */}
          <Card className="rounded-3xl shadow-md">
            <CardContent className="p-0">
              <div className="p-5 md:p-6 border-b">
                <h2 className="text-xl md:text-2xl font-bold text-[#333]">
                  Peringkat 4 - 100
                </h2>
                <p className="text-sm md:text-base text-[#8D8D8D] mt-1">
                  UMKM terbaik lainnya yang patut kamu dukung
                </p>
              </div>

              {isLoading ? (
                <div className="divide-y">
                  {Array.from({ length: 10 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="p-4 md:p-5 flex items-center gap-4 animate-pulse"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3" />
                        <div className="h-3 bg-gray-200 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="divide-y">
                  {rankedMerchants
                    .slice(3, 20)
                    .map(
                      (merchant: (typeof rankedMerchants)[0], idx: number) => {
                        const rank = idx + 4;
                        const topBadge = getTopBadge(rank);

                        return (
                          <div
                            key={merchant.id}
                            className="p-4 md:p-5 lg:p-6 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center gap-3 md:gap-4">
                              {/* Rank */}
                              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-lg md:text-xl font-bold text-[#333]">
                                  {rank}
                                </span>
                              </div>

                              {/* Merchant Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm md:text-base lg:text-lg font-bold text-[#333] truncate">
                                  {merchant.name}
                                </h3>
                                <div className="flex items-center gap-2 md:gap-3 mt-1 flex-wrap">
                                  <span className="text-xs md:text-sm text-[#8D8D8D]">
                                    {merchant.type}
                                  </span>
                                  <span className="text-xs text-[#8D8D8D]">
                                    •
                                  </span>
                                  <span className="text-xs md:text-sm text-[#8D8D8D] flex items-center gap-1">
                                    ⭐ {merchant.rating}
                                  </span>
                                  <span className="text-xs text-[#8D8D8D]">
                                    •
                                  </span>
                                  <span className="text-xs md:text-sm text-green-600 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />+
                                    {merchant.growth}%
                                  </span>
                                </div>
                              </div>

                              {/* Score */}
                              <div className="text-right flex-shrink-0">
                                <p className="text-base md:text-lg lg:text-xl font-bold text-primary">
                                  {merchant.score}
                                </p>
                                <p className="text-xs text-[#8D8D8D]">Score</p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Section */}
          <Card className="rounded-3xl bg-[#FFF7ED] border-primary/20 mt-8 md:mt-10">
            <CardContent className="p-5 md:p-6 lg:p-8">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-[#333] mb-2">
                    Bagaimana Ranking Dihitung?
                  </h3>
                  <ul className="text-xs md:text-sm text-[#8D8D8D] space-y-1.5 leading-relaxed">
                    <li>
                      • <strong>Transaksi (40%)</strong>: Jumlah dan nilai
                      transaksi berhasil
                    </li>
                    <li>
                      • <strong>Rating (30%)</strong>: Rating dan ulasan dari
                      pelanggan
                    </li>
                    <li>
                      • <strong>Pertumbuhan (20%)</strong>: Peningkatan performa
                      dari waktu ke waktu
                    </li>
                    <li>
                      • <strong>Engagement (10%)</strong>: Interaksi dengan
                      pelanggan dan komunitas
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageContainer>
      </Section>
    </>
  );
};

export default Top100Page;
