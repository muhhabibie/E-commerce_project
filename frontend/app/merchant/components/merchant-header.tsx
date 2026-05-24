"use client";
import Check from "@/components/icons/check";
import FluentChat from "@/components/icons/fluent-chat";
import LocationIcon from "@/components/icons/location";
import RatingStar from "@/components/icons/rating-star";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useClickLike from "@/hooks/landing-page/use-click-like";
import { Merchant } from "@/types";
import { Flag, Heart } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Store from "@/components/icons/store";
import useGetUser from "@/hooks/auth/use-get-user";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import DialogLogin from "@/components/shared/dialog-login";
import DialogSignup from "@/components/shared/dialog-signup";
import DialogLoginEmail from "@/components/shared/dialog-login-email";

type MerchantInfo = {
  amount: number | string | undefined;
  text: string;
};

interface MerchantHeaderProps {
  isLoading: boolean;
  merchant: Merchant | null;
}
const MerchantHeader = ({ isLoading, merchant }: MerchantHeaderProps) => {
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: user } = useGetUser();
  const {
    openModal,
    defaultModalIsOpen,
    closeModal,
    signInIsOpen,
    signUpIsOpen,
    onCloseSignup,
  } = useOpenModal();
  const isAuthenticated = !!user;

  const handleSubmitReport = () => {
    // untuk saat ini hanya tampilkan toast statis
    toast.success("Terima kasih, laporanmu sudah kami terima.");
    setReportOpen(false);
    setSelectedCategory(null);
  };

  const handleFollowClick = () => {
    if (!isAuthenticated) {
      openModal("default");
      return;
    }
    // Logic untuk follow merchant
    toast.success("Berhasil mengikuti merchant!");
  };

  const heroSrc = merchant?.profilePhotoUrl || "/images/merchant-image.png";

  const merchantInfo: MerchantInfo[] = [
    { amount: merchant?.stocks?.length ?? 0, text: "Produk" },
    { amount: merchant?.selledStocks?.length ?? 0, text: "Terjual" },
    { amount: merchant?.total_follower ?? 0, text: "Pengikut" },
  ];
  const { isLiked, toggleLike } = useClickLike();

  return (
    <Section className="!px-0 py-4 md:py-6">
      <PageContainer>
        <div className="relative lg:grid grid-cols-2 gap-4 lg:gap-6 lg:items-start">
          {isLoading ? (
            <Skeleton className="w-full h-[220px] md:h-[260px] lg:h-[340px] lg:rounded-3xl" />
          ) : (
            <Image
              src={heroSrc}
              alt={`Foto ${merchant?.name || "merchant"}`}
              className="w-full h-[220px] md:h-[260px] lg:h-[340px] object-cover lg:rounded-3xl"
              width={1200}
              height={300}
              priority
            />
          )}

          <div className="absolute inset-x-0 -bottom-10 flex justify-center px-4 lg:static lg:mt-0">
            <div className="w-full max-w-xl lg:max-w-none rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] px-5 py-5 md:px-6 md:py-6 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3 lg:w-full">
                <div className="lg:flex flex-col-reverse lg:w-full gap-3">
                  <div>
                    {isLoading ? (
                      <Skeleton className="w-[200px] h-4 rounded-lg mt-2 " />
                    ) : (
                      <h1 className="text-xl md:text-2xl lg:text-[30px] font-extrabold line-clamp-2 text-[#333]">
                        {merchant?.name || "Merchant"}
                      </h1>
                    )}
                    <div className="lg:flex hidden items-center gap-1.5 mt-2">
                      {isLoading ? (
                        <Skeleton className="w-[120px] h-4 rounded mt-7" />
                      ) : (
                        <>
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <span key={idx} className="hidden lg:inline-block">
                              <RatingStar className="text-yellow-400" />
                            </span>
                          ))}
                          <h1 className="text-[#333] lg:text-[22px] md:text-lg text-base font-semibold">
                            4.9
                          </h1>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-x-2 relative w-full font-semibold flex mt-2 lg:mt-0">
                    {isLoading ? (
                      <Skeleton className="w-[150px] h-8" />
                    ) : (
                      <Badge className="bg-[#FFF7ED] border-primary text-primary lg:px-3 lg:py-2">
                        <LocationIcon className="text-transparent" />
                        <p className="text-xs lg:text-base font-semibold">
                          2 km dari lokasimu
                        </p>
                      </Badge>
                    )}
                    {isLoading ? (
                      <Skeleton className="w-[150px] h-8" />
                    ) : merchant?.verified ? (
                      <Badge className="border border-[#7BF1A8] bg-[#E6FFEF] text-[#027A48] lg:px-3 lg:py-2 mt-2">
                        <Check />
                        <p className="text-xs lg:text-base font-semibold">
                          Terverifikasi
                        </p>
                      </Badge>
                    ) : null}
                  </div>
                </div>

                {isLoading ? (
                  <Skeleton className="h-[44px] w-[120px] rounded-lg lg:hidden" />
                ) : (
                  <div className="bg-primary rounded-lg border shadow-md lg:hidden">
                    <div className="flex items-center justify-center gap-2 font-bold text-white px-3 py-1 shrink-0">
                      <p className="text-sm lg:text-base">4,8</p>
                      <RatingStar className="text-yellow-400" />
                    </div>
                    <div className="bg-white gap-1 flex items-center p-1">
                      <FluentChat className="size-3 text-[#808080] " />
                      <p className="text-xs">128 ulasan</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-around lg:justify-start lg:gap-16 xl:gap-20 mt-5 md:mt-6">
                {isLoading
                  ? Array.from({ length: 3 }).map((_, idx) => (
                      <div key={idx} className="text-center space-y-2">
                        <Skeleton className="w-16 h-6 mx-auto" />
                        <Skeleton className="w-20 h-4 mx-auto" />
                      </div>
                    ))
                  : merchantInfo.map((item, idx) => (
                      <div key={idx} className="text-center">
                        <h1 className="lg:text-[25px] text-[20px] font-bold text-primary">
                          {item.amount}
                        </h1>
                        <p className="text-[#8D8D8D]">{item.text}</p>
                      </div>
                    ))}
              </div>
              {isLoading ? (
                <Skeleton className="h-10 w-28 mt-4 rounded" />
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 mt-5 md:mt-6">
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={handleFollowClick}
                      className="bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] lg:text-lg text-sm md:text-base px-5 py-2.5 md:px-6 md:py-3"
                    >
                      Ikuti
                    </Button>
                    <Link
                      href={(merchant?.google_map_url as string) ?? ""}
                      target="_blank"
                    >
                      <Button
                        variant={"outline"}
                        className="px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base"
                      >
                        Lihat Peta
                      </Button>
                    </Link>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setReportOpen(true)}
                    variant="outline"
                    className="border-[#FFD5D5] bg-[#FFF5F5] text-[#ED3437] hover:bg-[#FFE5E5] hover:text-[#ED3437] px-4 py-2.5 md:px-5 md:py-2.5 text-sm md:text-base flex items-center gap-2"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Laporkan</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Dialog Laporkan Merchant */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-xl w-[90vw] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-extrabold text-[#333]">
              Laporkan Merchant
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-[#606060]">
              Bantu kami menjaga kualitas merchant di platform Qoin.in
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            <div className="border rounded-2xl px-4 py-3 bg-[#FFF7ED] flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Store />
                <p className="font-semibold text-sm md:text-base text-[#333]">
                  {merchant?.name ?? "Merchant"}
                </p>
              </div>
              <p className="text-xs md:text-sm text-[#8D8D8D]">
                {merchant?.location ?? "Lokasi merchant tidak tersedia"}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold mb-2 text-secondary">
                Pilih Kategori Laporan
              </p>
              <RadioGroup
                value={selectedCategory ?? ""}
                onValueChange={(val: string) => setSelectedCategory(val)}
                className="space-y-3"
              >
                <Label
                  htmlFor="report-fake"
                  className="flex items-start gap-3 border rounded-2xl px-4 py-3 cursor-pointer hover:bg-[#FFF7ED]"
                >
                  <RadioGroupItem
                    id="report-fake"
                    value="fake"
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#333]">
                      Merchant Fiktif / Tidak Ditemukan
                    </span>
                    <span className="block text-xs text-[#8D8D8D]">
                      Merchant tidak ada di lokasi yang tertera
                    </span>
                  </span>
                </Label>

                <Label
                  htmlFor="report-location"
                  className="flex items-start gap-3 border rounded-2xl px-4 py-3 cursor-pointer hover:bg-[#FFF7ED]"
                >
                  <RadioGroupItem
                    id="report-location"
                    value="location"
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#333]">
                      Alamat / Lokasi Salah
                    </span>
                    <span className="block text-xs text-[#8D8D8D]">
                      Lokasi di peta tidak sesuai dengan lokasi sebenarnya
                    </span>
                  </span>
                </Label>

                <Label
                  htmlFor="report-photo"
                  className="flex items-start gap-3 border rounded-2xl px-4 py-3 cursor-pointer hover:bg-[#FFF7ED]"
                >
                  <RadioGroupItem
                    id="report-photo"
                    value="photo"
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-[#333]">
                      Foto Tidak Sesuai
                    </span>
                    <span className="block text-xs text-[#8D8D8D]">
                      Foto tidak sesuai dengan kondisi merchant
                    </span>
                  </span>
                </Label>
              </RadioGroup>
            </div>
          </div>

          <div className="mt-6">
            <Button
              className="w-full bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] text-white text-sm md:text-base py-3 rounded-2xl"
              onClick={handleSubmitReport}
              disabled={!selectedCategory}
            >
              Kirim Laporan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Login */}
      <DialogLogin
        open={defaultModalIsOpen}
        onClose={closeModal}
        openModal={openModal}
      />
      <DialogSignup open={signUpIsOpen} onClose={onCloseSignup} />
      <DialogLoginEmail open={signInIsOpen} onClose={closeModal} />
    </Section>
  );
};

export default MerchantHeader;
