"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ArrowLeft } from "lucide-react";
import Image from "next/image";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";
import { Skeleton } from "@/components/ui/skeleton";

const RatingReviewPage = () => {
  const router = useRouter();
  const { paymentId } = useParams();
  const { merchant, isLoading } = useGetMerchantById(paymentId as string);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Silakan berikan rating terlebih dahulu");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      localStorage.removeItem("orderStatus");
      localStorage.removeItem("qoin.cart");
      localStorage.removeItem("grandTotal");
    } catch (err) {
      console.log(err);
    }

    setIsSubmitting(false);
    router.push("/");
  };

  const handleSkip = () => {
    try {
      localStorage.removeItem("orderStatus");
      localStorage.removeItem("qoin.cart");
      localStorage.removeItem("grandTotal");
    } catch (err) {
      console.log(err);
    }
    router.push("/");
  };

  return (
    <>
      <Section className="mt-6 md:mt-8 lg:mt-10 min-h-screen">
        <PageContainer>
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <Button
                variant="ghost"
                className="mb-4 px-2 hover:bg-transparent"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Kembali
              </Button>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#333] mb-2">
                Beri Rating & Ulasan
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D] leading-relaxed">
                Bantu UMKM berkembang dengan memberikan rating dan ulasan jujur
                kamu
              </p>
            </div>

            {/* Merchant Info Card */}
            <Card className="rounded-3xl shadow-md mb-6">
              <CardHeader className="px-4 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 border-b">
                <div className="flex items-center gap-3 md:gap-4">
                  {isLoading ? (
                    <>
                      <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-2xl" />
                      <div className="space-y-2">
                        <Skeleton className="w-32 md:w-48 h-4 md:h-5" />
                        <Skeleton className="w-24 md:w-32 h-3 md:h-4" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-gray-100">
                        {merchant?.profilePhotoUrl ? (
                          <Image
                            src={merchant.profilePhotoUrl}
                            alt={merchant.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                            {merchant?.name?.charAt(0) || "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <h2 className="text-base md:text-lg lg:text-xl font-bold text-[#333]">
                          {merchant?.name || "Merchant"}
                        </h2>
                        <p className="text-xs md:text-sm text-[#8D8D8D]">
                          {merchant?.type || "UMKM Lokal"}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-4 md:px-6 lg:px-8 py-6 md:py-7 lg:py-8">
                {/* Rating Section */}
                <div className="space-y-4 md:space-y-5 mb-6 md:mb-8">
                  <div>
                    <label className="text-sm md:text-base lg:text-lg font-semibold text-[#333] mb-3 block">
                      Berikan Rating
                    </label>
                    <div className="flex items-center gap-2 md:gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform duration-200 hover:scale-110 focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 transition-colors duration-200 ${
                              star <= (hoverRating || rating)
                                ? "fill-[#FDB022] text-[#FDB022]"
                                : "fill-none text-[#E5E7EB]"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="mt-3 text-xs md:text-sm text-[#8D8D8D]">
                        {rating === 1 && "Sangat Buruk"}
                        {rating === 2 && "Buruk"}
                        {rating === 3 && "Cukup"}
                        {rating === 4 && "Bagus"}
                        {rating === 5 && "Sangat Bagus"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Review Section */}
                <div className="space-y-3 md:space-y-4">
                  <label className="text-sm md:text-base lg:text-lg font-semibold text-[#333] block">
                    Tulis Ulasan (Opsional)
                  </label>
                  <Textarea
                    placeholder="Ceritakan pengalaman kamu berbelanja di sini. Apa yang kamu suka? Ada saran untuk merchant?"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="min-h-[120px] md:min-h-[140px] lg:min-h-[160px] text-sm md:text-base resize-none rounded-2xl border-[#E5E7EB] focus:border-primary focus:ring-primary"
                  />
                  <p className="text-xs md:text-sm text-[#8D8D8D]">
                    {review.length}/500 karakter
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-4 mt-6 md:mt-8 lg:mt-10">
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    disabled={isSubmitting}
                    className="w-full md:w-auto md:flex-1 py-5 md:py-6 text-sm md:text-base font-semibold border-2 border-[#E5E7EB] hover:border-primary hover:text-primary hover:bg-transparent rounded-full"
                  >
                    Lewati
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || rating === 0}
                    className="w-full md:flex-[2] py-5 md:py-6 text-sm md:text-base font-semibold bg-primary hover:bg-primary/90 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Rating & Ulasan"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="rounded-3xl bg-[#FFF7ED] border-primary/20">
              <CardContent className="px-4 md:px-6 py-4 md:py-5">
                <p className="text-xs md:text-sm lg:text-base text-[#8D8D8D] leading-relaxed">
                  💡 <span className="font-semibold text-[#333]">Tips:</span>{" "}
                  Rating dan ulasan yang jujur sangat membantu UMKM untuk
                  berkembang dan membantu pembeli lain dalam memilih produk.
                </p>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </Section>
    </>
  );
};

export default RatingReviewPage;
