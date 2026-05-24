"use client";

import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import Footer from "@/components/section/footer";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import useGetMerchantByType from "@/hooks/merchant/use-get-merchant-by-type";
import useGetAllMerchant from "@/hooks/merchant/use-get-all-merchant";
import { useParams } from "next/navigation";
import DisplayMerchant from "@/components/shared/display-merchant";
import type { DisplayMerchantType, Merchant } from "@/types";

const MerchantTypePage = () => {
  const { openModal } = useOpenModal();
  const params = useParams();
  const typeParam = (params?.type as string) ?? "";
  const isAllType = typeParam.toLowerCase() === "semua";

  const {
    merchants: allMerchants,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useGetAllMerchant();

  const {
    merchants: typeMerchants,
    isLoading: isLoadingType,
    isError: isErrorType,
  } = useGetMerchantByType(typeParam);

  const merchants = isAllType ? allMerchants : typeMerchants;
  const isLoading = isAllType ? isLoadingAll : isLoadingType;
  const isError = isAllType ? isErrorAll : isErrorType;

  const hasMerchants = merchants.length > 0;

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-10">
        <PageContainer>
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-secondary capitalize">
              {typeParam.toLowerCase() === "semua"
                ? "Semua Merchant"
                : `Merchant ${
                    {
                      makanan: "Makanan",
                      minuman: "Minuman",
                      salon: "Salon & Spa",
                      fashion: "Toko Fashion",
                      kelontong: "Toko Kelontong",
                      jasa: "Jasa",
                      lainnya: "Lainnya",
                    }[typeParam.toLowerCase()] ?? typeParam
                  }`}
            </h1>
            <p className="text-sm md:text-base text-[#606060] mt-1">
              Jelajahi merchant berdasarkan kategori pilihanmu.
            </p>
          </div>

          {isLoading && (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-[260px] rounded-[20px] bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && isError && (
            <p className="text-red-500 text-sm md:text-base">
              Terjadi kesalahan saat memuat merchant. Silakan coba lagi.
            </p>
          )}

          {!isLoading && !isError && !hasMerchants && (
            <p className="text-sm md:text-base text-[#606060]">
              Type merchant ini tidak ada.
            </p>
          )}

          {!isLoading && !isError && hasMerchants && (
            <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-4">
              {merchants.map((m: Merchant) => {
                const minPrice =
                  m.stocks && m.stocks.length > 0
                    ? Math.min(...m.stocks.map((s) => s.price))
                    : null;

                const displayMerchant: DisplayMerchantType = {
                  id: m.id,
                  name: m.name,
                  profilePhotoUrl: m.profilePhotoUrl,
                  minPrice,
                };

                return (
                  <DisplayMerchant
                    key={m.id}
                    displayMerchant={displayMerchant}
                  />
                );
              })}
            </div>
          )}
        </PageContainer>
      </Section>
      <Footer />
    </>
  );
};

export default MerchantTypePage;
