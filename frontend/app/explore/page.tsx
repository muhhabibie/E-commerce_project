"use client";

import { useState, useEffect, useRef } from "react";
import { Subject } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import useGetAllMerchant from "@/hooks/merchant/use-get-all-merchant";
import useGetUser from "@/hooks/auth/use-get-user";
import { useRouter } from "next/navigation";
import DialogLogin from "@/components/shared/dialog-login";
import DialogLoginEmail from "@/components/shared/dialog-login-email";
import DialogSignup from "@/components/shared/dialog-signup";
import DisplayMerchant from "@/components/shared/display-merchant";
import { Search, MapPin, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Merchant } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LocationBadge from "@/components/shared/location-badge";

const categories = [
  { label: "Semua", value: "all" },
  { label: "Salon & Spa", value: "salon" },
  { label: "Toko Fashion", value: "fashion" },
  { label: "Warung Makan", value: "makanan" },
  { label: "Toko Kelontong", value: "kelontong" },
  { label: "Workshop & Jasa", value: "workshop_jasa" },
  { label: "Lainnya", value: "lainnya" },
];

const ExplorePage = () => {
  const router = useRouter();
  const {
    closeModal,
    openModal,
    onCloseSignup,
    signUpIsOpen,
    defaultModalIsOpen,
    signInIsOpen,
  } = useOpenModal();
  const { data: userData, isError } = useGetUser();
  const { merchants, isLoading } = useGetAllMerchant();
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"popular" | "nearest" | "newest">(
    "popular"
  );

  const searchSubjectRef = useRef<Subject<string> | null>(null);

  useEffect(() => {
    const subject = new Subject<string>();
    searchSubjectRef.current = subject;

    const subscription = subject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe((query) => {
        setSearchQuery(query);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const safeDisplayMerchant = Array.isArray(merchants)
    ? merchants
    : [];

  // Filter merchants based on search and category
  const filteredMerchants = safeDisplayMerchant.filter((merchant: Merchant) => {
    const matchesSearch = merchant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || merchant.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-6 md:mt-8 lg:mt-10 min-h-screen pb-10">
        <PageContainer>
          {/* Hero Section */}
          <div className="mb-8 md:mb-10 lg:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#333] mb-3 md:mb-4">
              Jelajahi UMKM
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D] leading-relaxed max-w-3xl">
              Temukan dan dukung UMKM lokal di sekitarmu. Setiap pembelian
              membantu mereka berkembang dan kamu dapat Qoin!
            </p>
          </div>

          {/* Search & Filter Section */}
          <Card className="rounded-3xl shadow-md mb-6 md:mb-8">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row gap-3 md:gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8D8D8D]" />
                  <Input
                    placeholder="Cari nama UMKM atau produk..."
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      searchSubjectRef.current?.next(e.target.value);
                    }}
                    className="pl-12 pr-4 py-5 md:py-6 rounded-2xl border-[#E5E7EB] focus:border-primary text-sm md:text-base"
                  />
                </div>

                {/* Location Badge */}
                <LocationBadge />

                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="gap-2 rounded-2xl border-[#E5E7EB] hover:border-primary px-4 py-5 md:py-6"
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span className="text-sm md:text-base">
                        {sortBy === "popular"
                          ? "Terpopuler"
                          : sortBy === "nearest"
                          ? "Terdekat"
                          : "Terbaru"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => setSortBy("popular")}>
                      Terpopuler
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("nearest")}>
                      Terdekat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("newest")}>
                      Terbaru
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 md:gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold whitespace-nowrap transition-colors ${
                      selectedCategory === category.value
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-[#8D8D8D] hover:bg-gray-200"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-4 md:p-5 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  {safeDisplayMerchant.length}+
                </p>
                <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">
                  UMKM Terdaftar
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-4 md:p-5 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  500+
                </p>
                <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">
                  Produk Tersedia
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-4 md:p-5 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  50+
                </p>
                <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">
                  Kota Terjangkau
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-4 md:p-5 text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">
                  10K+
                </p>
                <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">
                  Transaksi Berhasil
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Results Header */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#333]">
              {filteredMerchants.length > 0
                ? `${filteredMerchants.length} UMKM Ditemukan`
                : "Mencari UMKM..."}
            </h2>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-sm md:text-base text-primary hover:underline"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Merchants Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, idx) => (
                <Card key={idx} className="rounded-3xl overflow-hidden">
                  <div className="h-[140px] md:h-[180px] lg:h-[220px] bg-gray-200 animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMerchants.length === 0 ? (
            <Card className="rounded-3xl shadow-md">
              <CardContent className="p-12 md:p-16 text-center">
                <Filter className="w-16 h-16 md:w-20 md:h-20 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg md:text-xl font-bold text-[#333] mb-2">
                  Tidak Ada UMKM Ditemukan
                </h3>
                <p className="text-sm md:text-base text-[#8D8D8D] mb-6">
                  Coba ubah kata kunci pencarian atau filter kategori
                </p>
                <Button
                  onClick={() => {
                    setInputValue("");
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 py-2"
                >
                  Reset Pencarian
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
              {filteredMerchants.map((merchant: Merchant, idx: number) => (
                <DisplayMerchant
                  key={merchant.id || idx}
                  displayMerchant={merchant}
                  isLoading={false}
                />
              ))}
            </div>
          )}

          {/* CTA Section */}
          <Card className="rounded-3xl shadow-lg mt-10 md:mt-12 lg:mt-15 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
            <CardContent className="p-6 md:p-8 lg:p-10 text-center">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#333] mb-3 md:mb-4">
                UMKM Kamu Belum Terdaftar?
              </h3>
              <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D] mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
                Daftarkan UMKM kamu sekarang dan raih peluang lebih besar untuk
                berkembang bersama komunitas Qoin!
              </p>
              <Button
                onClick={() => {
                  if (userData && !isError) {
                    router.push("/merchant/onboarding");
                  } else {
                    openModal("default");
                  }
                }}
                className="rounded-full bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-5 md:py-6 text-sm md:text-base font-semibold"
              >
                Daftar UMKM Sekarang
              </Button>
            </CardContent>
          </Card>
        </PageContainer>
      </Section>
    </>
  );
};

export default ExplorePage;
