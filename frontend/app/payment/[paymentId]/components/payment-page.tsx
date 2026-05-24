"use client";

import { formatPrice } from "@/lib/format-price";
import { useCountdown } from "@/hooks/payment/use-countdown";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";

interface PaymentProductsProps {
  total: number;
  handlePage: (page: import("@/hooks/payment/use-payment").OrderStatus) => void;
  isPickup?: boolean;
}

const PaymentProducts = ({
  total,
  handlePage,
  isPickup = false,
}: PaymentProductsProps) => {
  const { label } = useCountdown();
  const [grandTotal, setGrandTotal] = useState<string | null>(null);
  const { paymentId } = useParams(); // paymentId di route payment adalah merchantId

  useEffect(() => {
    const grandTotal = localStorage.getItem("grandTotal");
    setGrandTotal(grandTotal);
  }, []);

  const handleCheckStatus = async () => {
    try {
      const storedCart = localStorage.getItem("qoin.cart");
      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        const itemsPayload = cartItems.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          merchant_id: paymentId,
        }));

        // Generate ID pembayaran unik
        const paymentUniqueId = `PAY-${Date.now()}`;

        // Kirim transaksi ke backend
        await axiosInstance.post(`/api/stocks/selled-stock/${paymentUniqueId}`, {
          items: itemsPayload,
        });

        toast.success("Pembayaran berhasil diverifikasi!");
      }
    } catch (error) {
      console.error("[checkout.status] error:", error);
      toast.error("Gagal memproses transaksi. Stok tidak mencukupi atau database error.");
      return; // Stop flow bila gagal agar user tidak lanjut
    }

    if (isPickup) {
      handlePage("delivered"); // "pickup-confirmation" → sesuai dengan enum order_status
    } else {
      handlePage("searching");
    }
  };

  return (
    // width tetap mengikuti container parent (tidak diubah)
    <div className="max-w-1/2 mx-auto space-y-8">
      <header className="flex items-start justify-between text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Total Pembayaran</p>
          <p className="text-primary lg:text-lg text-base font-bold">
            Rp {formatPrice(total ?? 0)}
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="text-muted-foreground">Bayar Dalam</p>
          <p className="text-[13px] font-semibold text-[#FF5B00]">{label}</p>
          <p className="text-[11px] text-muted-foreground">
            Jatuh tempo 12 Nov 2025, 21:08
          </p>
        </div>
      </header>

      {/* Kartu QRIS */}
      <section className="mx-auto max-w-md rounded-[24px] border border-[#F0F0F0] bg-white px-10 py-8 shadow-sm">
        {/* Logo atas */}
        <div className="mb-6 flex items-center justify-between text-xs font-semibold text-[#333]">
          <span>QRIS</span>
          <div className="text-right leading-tight">
            <p>Qoin.in</p>
            <p className="text-[10px] font-normal text-muted-foreground">
              NMID: IDI20193287626A01
            </p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-center">
          <Image
            src={"/images/qrcode.png"}
            alt="Qr code"
            width={230}
            height={230}
          />
        </div>

        <button
          type="button"
          className="mx-auto mt-2 flex h-11 w-44 items-center justify-center rounded-full bg-[#FF7A1A] text-[13px] font-semibold text-white shadow-sm transition hover:bg-[#ff8a33]"
        >
          Unduh QR
        </button>
      </section>

      {/* Cara Pembayaran */}
      <section className="mx-auto max-w-md  leading-relaxed text-[#444]">
        <h3 className="mb-3 font-semibold text-[#222]">Cara Pembayaran</h3>
        <ol className="space-y-1 list-decimal list-inside">
          <li>Buka aplikasi e-wallet atau mobile banking</li>
          <li>Pilih menu Scan QR</li>
          <li>Scan kode QR di atas ini</li>
          <li>Periksa nominal pembayaran</li>
          <li>Selesaikan pembayaran hingga muncul notifikasi berhasil</li>
        </ol>
        <div className="pb-8">
          <Button
            className="font-bold lg:text-xl mt-4 w-full bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] py-6 group relative overflow-hidden flex justify-center items-center"
            onClick={handleCheckStatus}
          >
            <span className="absolute inset-0 bg-[linear-gradient(79deg,#FD6700_64.73%,#FF944B_114.39%)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />

            <p className="z-100">Cek Status Pembayaran</p>
            <ShieldCheck className="group-hover:translate-x-2 duration-500 transition-all" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default PaymentProducts;
