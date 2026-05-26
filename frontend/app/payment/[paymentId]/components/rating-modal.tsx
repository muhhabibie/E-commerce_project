"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, X, Camera, Gift } from "lucide-react";
import Image from "next/image";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

const STAR_LABELS: Record<number, string> = {
  1: "Sangat Buruk",
  2: "Buruk",
  3: "Cukup",
  4: "Bagus",
  5: "Sangat Baik",
};

interface RatingModalProps {
  merchantId: string;
  onClose?: () => void; // optional: called after skip/submit
}

const RatingModal = ({ merchantId, onClose }: RatingModalProps) => {
  const router = useRouter();
  const { merchant, isLoading } = useGetMerchantById(merchantId);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUsername, setShowUsername] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [cartItems, setCartItems] = useState<
    { name: string; quantity: number; price: number; image?: string }[]
  >([]);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("qoin.cart");
      if (stored) setCartItems(JSON.parse(stored));
    } catch {}
  }, []);

  const clearOrder = () => {
    try {
      localStorage.removeItem("orderStatus");
      localStorage.removeItem("qoin.cart");
      localStorage.removeItem("grandTotal");
      localStorage.removeItem("qoin.currentOrderId");
      localStorage.removeItem("qoin.currentPaymentId");
    } catch {}
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Silakan berikan rating terlebih dahulu");
      return;
    }
    const targetId = merchant?.id || merchantId;
    if (!targetId) {
      toast.error("ID merchant tidak ditemukan.");
      return;
    }
    setIsSubmitting(true);
    try {
      await axiosInstance.post(`/api/merchant/rating/${targetId}`, {
        rate: rating,
        comment: review.trim() || "",
      });
      toast.success("Terima kasih! Ulasan Anda berhasil dikirim.");
      clearOrder();
      onClose ? onClose() : router.push("/");
    } catch (err) {
      console.error("[submitRating] error:", err);
      toast.error("Gagal mengirim ulasan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    clearOrder();
    onClose ? onClose() : router.push("/");
  };

  const activeRating = hoverRating || rating;

  return (
    /* Full-screen backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden"
        style={{
          animation: mounted
            ? "ratingModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both"
            : "none",
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">Nilai Produk</h2>
          <button
            onClick={handleSkip}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Reward banner */}
        <div className="mx-5 mt-4 mb-3 flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Gift className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-amber-700">
              Beri penilaian &amp; dapatkan 25 Koin!
            </span>
          </div>
          <svg
            className="w-4 h-4 text-amber-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Product item(s) */}
        <div className="px-5 space-y-3 max-h-40 overflow-y-auto">
          {isLoading ? (
            <div className="flex gap-3 animate-pulse">
              <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            cartItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-300">
                      {item.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {item.quantity}x &nbsp;·&nbsp; dari{" "}
                    {merchant?.name || "Merchant"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                {merchant?.profilePhotoUrl ? (
                  <Image
                    src={merchant.profilePhotoUrl}
                    alt={merchant.name}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-300">
                    {merchant?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {merchant?.name || "Merchant"}
                </p>
                <p className="text-xs text-gray-400">
                  {merchant?.type || "UMKM Lokal"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 mt-4">
          {/* Star rating */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">
              Kualitas Produk
            </p>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform duration-150 hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-9 h-9 transition-colors duration-150 ${
                      star <= activeRating
                        ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                </button>
              ))}
              {activeRating > 0 && (
                <span className="ml-2 text-sm font-semibold text-amber-500 transition-all">
                  {STAR_LABELS[activeRating]}
                </span>
              )}
            </div>
          </div>

          {/* Review textarea */}
          <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden">
            <textarea
              value={review}
              onChange={(e) => {
                if (e.target.value.length <= 500) setReview(e.target.value);
              }}
              placeholder={`Ceritakan pengalaman berbelanja di ${
                merchant?.name || "sini"
              }. Apa yang kamu suka?`}
              rows={4}
              className="w-full px-4 pt-3 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none bg-white"
            />
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-100">
              <button
                type="button"
                onClick={() => toast.info("Fitur upload foto segera hadir!")}
                className="flex items-center gap-1.5 text-xs font-medium text-[#EE4D2D] hover:text-[#c73d24] transition-colors"
              >
                <Camera className="w-4 h-4" />
                Tambah Foto
              </button>
              <span className="text-xs text-gray-400">{review.length}/500</span>
            </div>
          </div>

          {/* Show username toggle */}
          <label className="flex items-center gap-2.5 mt-3 cursor-pointer">
            <div
              className={`relative w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                showUsername
                  ? "bg-[#EE4D2D] border-[#EE4D2D]"
                  : "border-gray-300"
              }`}
              onClick={() => setShowUsername((p) => !p)}
            >
              {showUsername && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  viewBox="0 0 12 10"
                >
                  <path
                    d="M1 5l3.5 3.5L11 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <p className="text-xs text-gray-700">
              Tampilkan username pada penilaian
            </p>
          </label>
        </div>

        {/* Divider */}
        <div className="mt-4 border-t border-gray-100" />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-5 py-4">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-semibold text-gray-500 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            NANTI SAJA
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className={`px-8 py-2 text-sm font-bold text-white rounded-full transition-all ${
              rating === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#EE4D2D] hover:bg-[#d43d22] shadow-md shadow-red-200 active:scale-95"
            } disabled:opacity-60`}
          >
            {isSubmitting ? "Mengirim..." : "OK"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ratingModalIn {
          from { opacity: 0; transform: scale(0.85) translateY(20px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default RatingModal;
