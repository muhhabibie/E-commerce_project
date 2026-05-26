"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Subject, Subscription } from "rxjs";
import { exhaustMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format-price";
import useAddProductToCart from "@/hooks/merchant/use-add-product-to-cart";
import { Coins } from "lucide-react";
import useGetUser from "@/hooks/auth/use-get-user";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useParams } from "next/navigation";

const SERVICE_FEE_RATE = 0.01; // 1%
const SHIPPING_COST = 20000; // static per Figma
const REDEEMABLE_QOIN = 150; // static placeholder

interface CardTotalProps {
  handlePage?: (page: import("@/hooks/payment/use-payment").OrderStatus) => void;
  isPickup?: boolean;
  selectedMethod: "bank" | "qris" | "saldo";
}

const CardTotal = ({ handlePage, isPickup = false, selectedMethod }: CardTotalProps) => {
  const { cart, totals } = useAddProductToCart();
  const [redeem, setRedeem] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { paymentId } = useParams();
  const { data } = useGetUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawUser = (data as any)?.data ?? (data as any) ?? {};
  const balance = rawUser?.balance ?? 0;

  // Subject: sensor klik tombol bayar
  const payClickRef = useRef<Subject<void>>(new Subject());
  const paySubRef = useRef<Subscription | null>(null);

  const subtotal = totals.totalPrice ?? 0;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  const shipping = isPickup ? 0 : SHIPPING_COST;
  const discount = redeem
    ? Math.min(REDEEMABLE_QOIN, subtotal + serviceFee + shipping)
    : 0;
  const totalBefore = subtotal + serviceFee + shipping;
  const grandTotal = Math.max(0, totalBefore - discount);

  const isInsufficientBalance = selectedMethod === "saldo" && grandTotal > balance;

  useEffect(() => {
    // Reactive pipeline: exhaustMap memastikan klik kedua DIABAIKAN selama transaksi pertama masih berjalan
    paySubRef.current = payClickRef.current
      .pipe(
        tap(() => setIsProcessing(true)),
        exhaustMap(() =>
          // Observable asinkronus: membungkus proses navigasi ke halaman pembayaran
          from(
            (async () => {
              if (selectedMethod === "saldo") {
                try {
                  const itemsPayload = cart.map((item: any) => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                    merchant_id: paymentId,
                  }));

                  const paymentUniqueId = `PAY-${Date.now()}`;
                  localStorage.setItem("qoin.currentPaymentId", paymentUniqueId);

                  // Call backend to deduct balance and record purchase
                  await axiosInstance.post(`/api/stocks/selled-stock/${paymentUniqueId}`, {
                    items: itemsPayload,
                    paymentMethod: "saldo",
                    amountToDeduct: grandTotal,
                  });

                  // Update cached user balance so it reflects instantly on UI
                  const updatedUser = { ...rawUser, balance: rawUser.balance - grandTotal };
                  localStorage.setItem("user", JSON.stringify({ ...data, data: updatedUser }));

                  toast.success("Pembayaran instan menggunakan Saldo berhasil!");

                  // Transit to tracking page
                  if (isPickup) {
                    handlePage && handlePage("delivered");
                  } else {
                    handlePage && handlePage("searching");
                  }
                } catch (error: any) {
                  console.error("[saldo.payment] error:", error);
                  const msg = error?.response?.data?.message || "Gagal memproses transaksi menggunakan Saldo.";
                  toast.error(msg);
                }
              } else {
                // Normal flow: navigate to payment page (shows QRIS)
                await new Promise<void>((resolve) =>
                  setTimeout(() => {
                    handlePage && handlePage("payment");
                    resolve();
                  }, 300)
                );
              }
            })()
          )
        ),
        tap(() => setIsProcessing(false))
      )
      .subscribe();

    return () => {
      paySubRef.current?.unsubscribe();
    };
  }, [handlePage, selectedMethod, grandTotal, cart, paymentId, isPickup, rawUser, data]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("grandTotal", grandTotal.toString());
      window.dispatchEvent(
        new CustomEvent("grandTotal:updated", { detail: grandTotal })
      );
    } catch {
      // ignore if storage unavailable
    }
  }, [grandTotal]);

  const items = useMemo(
    () =>
      cart.map((it) => ({
        label: `${it.quantity}x ${it.name}`,
        amount: it.price * it.quantity,
      })),
    [cart]
  );

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-[22px] font-bold">
          Ringkasan Pesanan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3">
          {items.map((row, idx) => (
            <div
              key={`${row.label}-${idx}`}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-[#333]">{row.label}</span>
              <span className="font-medium">Rp {formatPrice(row.amount)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed" />

        {/* Subtotals */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Subtotal ({totals.totalQty} Produk)
            </span>
            <span className="font-medium">Rp {formatPrice(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Biaya Layanan (1%)</span>
            <span className="font-medium">Rp {formatPrice(serviceFee)}</span>
          </div>
          {!isPickup && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Biaya Pengiriman</span>
              <span className="font-medium">Rp {formatPrice(shipping)}</span>
            </div>
          )}
        </div>

        {/* Redeem Qoin */}
        <div className="rounded-xl border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="grid size-7 place-items-center rounded-full bg-primary/15 text-primary">
                <Coins className="size-4" />
              </div>
              <span className="text-sm font-semibold">
                Tukarkan {REDEEMABLE_QOIN} Qoin
              </span>
            </div>
            <button
              type="button"
              aria-pressed={redeem}
              onClick={() => setRedeem((p) => !p)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                redeem ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white transition-transform ${
                  redeem ? "translate-x-6" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
          {redeem && (
            <div className="px-4 pb-3 text-right text-sm text-destructive">
              Potongan Qoin -Rp {formatPrice(discount)}
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex items-end justify-between">
          <span className="text-lg font-bold">Total</span>
          <div className="text-right">
            {discount > 0 && (
              <div className="text-sm text-muted-foreground line-through">
                Rp {formatPrice(totalBefore)}
              </div>
            )}
            <div className="text-xl font-bold">
              Rp {formatPrice(grandTotal)}
            </div>
          </div>
        </div>

        <Button
          className={`w-full h-12 rounded-xl text-base font-bold transition-all duration-300 ${
            isInsufficientBalance
              ? "bg-destructive/10 hover:bg-destructive/15 text-destructive border border-destructive/20 cursor-not-allowed"
              : ""
          }`}
          disabled={isProcessing || isInsufficientBalance}
          onClick={() => payClickRef.current.next()}
        >
          {isProcessing
            ? "Memproses..."
            : isInsufficientBalance
            ? `Saldo Tidak Cukup (Kurang Rp ${formatPrice(grandTotal - balance)})`
            : "Bayar Sekarang"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CardTotal;
