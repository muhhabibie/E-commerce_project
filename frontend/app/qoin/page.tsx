"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import useGetUser from "@/hooks/auth/use-get-user";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import DollarCoin from "@/components/icons/dollar-coin";
import {
  TrendingUp,
  Calendar,
  ShoppingBag,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  X,
  CheckCircle2,
  Minus,
  Plus,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

interface QoinTransaction {
  id: string;
  type: "earning" | "spending";
  description: string;
  amount: number;
  date: string;
  merchant: string;
  category: string;
}

/* ─── Redeem Modal ──────────────────────────────────────────── */
interface RedeemModalProps {
  balance: number;
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

const REDEEM_PRESETS = [50, 100, 250, 500];

const RedeemModal = ({ balance, onClose, onSuccess }: RedeemModalProps) => {
  const [amount, setAmount] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ redeemedAmount: number; equivalentRupiah: number; remainingBalance: number } | null>(null);

  const rupiah = amount * 1000;
  const canRedeem = balance >= amount && amount > 0;

  const handleRedeem = async () => {
    if (!canRedeem) return;
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/api/auth/user/redeem-qoin", { amount });
      const data = res.data?.data;
      setResult(data);
      setDone(true);
      onSuccess(data.remainingBalance);
      toast.success(`Berhasil menukar ${amount} Qoin = Rp ${rupiah.toLocaleString("id-ID")}!`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gagal menukar Qoin";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-[redeemIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary via-[#FF8E0D] to-[#FD6700] px-6 pt-6 pb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Tukar Qoin</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <DollarCoin className="w-8 h-8" />
            <div>
              <p className="text-xs opacity-80">Saldo Qoin kamu</p>
              <p className="text-3xl font-extrabold">{balance.toLocaleString("id-ID")}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {done && result ? (
            /* Success State */
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#333] mb-2">Penukaran Berhasil!</h3>
              <p className="text-[#8D8D8D] text-sm mb-4">
                {result.redeemedAmount} Qoin telah ditukar senilai
              </p>
              <div className="bg-green-50 rounded-2xl px-6 py-4 mb-4 border border-green-100">
                <p className="text-3xl font-extrabold text-green-600">
                  Rp {result.equivalentRupiah.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-green-500 mt-1">Sisa saldo: {result.remainingBalance} Qoin</p>
              </div>
              <p className="text-xs text-[#8D8D8D]">
                Nilai tukar akan dikreditkan ke saldo dompet digital kamu dalam 1x24 jam.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 rounded-full bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
              >
                Selesai
              </button>
            </div>
          ) : (
            /* Input State */
            <>
              <p className="text-sm text-[#8D8D8D] mb-4">
                1 Qoin = <span className="font-semibold text-primary">Rp 1.000</span>
              </p>

              {/* Preset chips */}
              <div className="flex gap-2 flex-wrap mb-4">
                {REDEEM_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                      amount === preset
                        ? "bg-primary text-white border-primary"
                        : "bg-gray-50 text-[#8D8D8D] border-gray-200 hover:border-primary hover:text-primary"
                    } ${balance < preset ? "opacity-40 cursor-not-allowed" : ""}`}
                    disabled={balance < preset}
                  >
                    {preset} Qoin
                  </button>
                ))}
              </div>

              {/* Manual input with +/- */}
              <div className="flex items-center gap-3 mb-2">
                <button
                  onClick={() => setAmount((v) => Math.max(1, v - 10))}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="number"
                    min={1}
                    max={balance}
                    value={amount}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(balance, Number(e.target.value)));
                      setAmount(val);
                    }}
                    className="w-full text-center text-2xl font-bold border-2 border-gray-200 rounded-2xl py-2.5 focus:outline-none focus:border-primary transition-colors"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8D8D8D]">Qoin</span>
                </div>
                <button
                  onClick={() => setAmount((v) => Math.min(balance, v + 10))}
                  disabled={amount >= balance}
                  className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Equivalent value */}
              <div className="bg-orange-50 rounded-2xl px-4 py-3 mb-5 border border-orange-100 text-center">
                <p className="text-xs text-[#8D8D8D]">Setara dengan</p>
                <p className="text-2xl font-extrabold text-primary">
                  Rp {rupiah.toLocaleString("id-ID")}
                </p>
              </div>

              {!canRedeem && amount > 0 && (
                <p className="text-xs text-red-500 text-center mb-3">
                  Saldo Qoin tidak mencukupi (saldo: {balance})
                </p>
              )}

              <button
                onClick={handleRedeem}
                disabled={!canRedeem || isSubmitting}
                className="w-full py-3.5 rounded-full bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-orange-200"
              >
                {isSubmitting ? "Memproses..." : `Tukar ${amount} Qoin`}
              </button>
            </>
          )}
        </div>

        <style>{`
          @keyframes redeemIn {
            from { opacity: 0; transform: scale(0.85) translateY(20px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

/* ─── Main Page ─────────────────────────────────────────────── */
const QoinPage = () => {
  const router = useRouter();
  const { openModal } = useOpenModal();
  const { data, isLoading: userLoading, isError } = useGetUser();
  const [filter, setFilter] = useState<"all" | "earning" | "spending">("all");
  const [transactions, setTransactions] = useState<QoinTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [showRedeem, setShowRedeem] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawUser = (data as any)?.data ?? (data as any) ?? {};
  const [qoinBalance, setQoinBalance] = useState<number>(0);

  const isAuthenticated = !!data && !isError;

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/auth/user/qoin-transactions");
      setTransactions(res.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil riwayat transaksi Qoin:", err);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw = (data as any)?.data ?? (data as any) ?? {};
    const bal = raw?.total_point ?? raw?.qoin ?? 0;
    setQoinBalance(bal);
  }, [data]);

  useEffect(() => {
    if (isAuthenticated) fetchTransactions();
  }, [isAuthenticated, fetchTransactions]);

  if (!userLoading && !isAuthenticated) {
    router.push("/");
    return null;
  }

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  const totalEarned = transactions
    .filter((t) => t.type === "earning")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = Math.abs(
    transactions
      .filter((t) => t.type === "spending")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-6 md:mt-8 lg:mt-10 min-h-screen pb-10">
        <PageContainer>
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#333] mb-2">
                Qoin Saya
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D]">
                Kelola dan pantau Qoin kamu dari setiap transaksi
              </p>
            </div>

            {userLoading || transactionsLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-48 rounded-3xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="h-32 rounded-3xl" />
                  <Skeleton className="h-32 rounded-3xl" />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Balance Card */}
                <Card className="rounded-3xl shadow-lg overflow-hidden bg-gradient-to-br from-primary via-[#FF8E0D] to-[#FD6700]">
                  <CardContent className="p-6 md:p-8 lg:p-10 text-white">
                    <div className="flex items-center justify-between mb-6 md:mb-8">
                      <div>
                        <p className="text-sm md:text-base opacity-90 mb-2">Total Qoin</p>
                        <div className="flex items-center gap-3">
                          <DollarCoin className="w-10 h-10 md:w-12 md:h-12 text-white" />
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
                            {qoinBalance.toLocaleString("id-ID")}
                          </h2>
                        </div>
                      </div>
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div>
                        <p className="text-xs md:text-sm opacity-75">Setara dengan</p>
                        <p className="text-base md:text-lg font-semibold">
                          Rp {(qoinBalance * 1000).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button
                        onClick={() => setShowRedeem(true)}
                        disabled={qoinBalance <= 0}
                        className="px-4 md:px-6 py-2 md:py-2.5 bg-white text-primary hover:bg-orange-50 rounded-full text-xs md:text-sm font-bold transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                      >
                        Tukar Qoin
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <Card className="rounded-3xl shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                          <ArrowUpRight className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-xs md:text-sm text-[#8D8D8D]">Total Diterima</span>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-[#333]">
                        {totalEarned.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">Qoin</p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                          <ArrowDownRight className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-xs md:text-sm text-[#8D8D8D]">Total Digunakan</span>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-[#333]">
                        {totalSpent.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">Qoin</p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs md:text-sm text-[#8D8D8D]">Transaksi</span>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-[#333]">
                        {transactions.length}
                      </p>
                      <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">Total</p>
                    </CardContent>
                  </Card>
                </div>

                {/* How to Earn Qoin Info */}
                <Card className="rounded-3xl bg-[#FFF7ED] border-primary/20">
                  <CardContent className="p-5 md:p-6">
                    <div className="flex items-start gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Gift className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-bold text-[#333] mb-2">
                          Cara Dapat Qoin
                        </h3>
                        <ul className="text-xs md:text-sm text-[#8D8D8D] space-y-1.5">
                          <li>• Belanja di UMKM mitra dan dapatkan 5% cashback Qoin</li>
                          <li>• Tulis review untuk merchant dan dapatkan 25 Qoin</li>
                          <li>• Referral teman baru dan dapatkan 100 Qoin</li>
                          <li>• Ikuti event dan promo spesial untuk bonus Qoin</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Transaction History */}
                <Card className="rounded-3xl shadow-md">
                  <CardHeader className="px-5 md:px-6 lg:px-8 py-5 md:py-6 border-b">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg md:text-xl font-bold text-[#333]">
                          Riwayat Transaksi
                        </h3>
                        <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">
                          Lihat detail perolehan & pengeluaran Qoin kamu
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {(["all", "earning", "spending"] as const).map((f) => (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                              filter === f
                                ? f === "earning"
                                  ? "bg-green-500 text-white"
                                  : f === "spending"
                                  ? "bg-red-500 text-white"
                                  : "bg-primary text-white"
                                : "bg-gray-100 text-[#8D8D8D] hover:bg-gray-200"
                            }`}
                          >
                            {f === "all" ? "Semua" : f === "earning" ? "Masuk" : "Keluar"}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="divide-y">
                      {filteredTransactions.length === 0 ? (
                        <div className="p-8 md:p-12 text-center">
                          <Calendar className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-300 mb-4" />
                          <p className="text-sm md:text-base text-[#8D8D8D]">
                            {filter === "all"
                              ? "Belum ada transaksi Qoin"
                              : filter === "earning"
                              ? "Belum ada Qoin masuk"
                              : "Belum ada Qoin keluar"}
                          </p>
                        </div>
                      ) : (
                        filteredTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="p-4 md:p-5 lg:p-6 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                                <div
                                  className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                                    transaction.type === "earning"
                                      ? "bg-green-100"
                                      : "bg-red-100"
                                  }`}
                                >
                                  {transaction.type === "earning" ? (
                                    transaction.category === "Bonus Review" ? (
                                      <Award className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                    ) : transaction.category === "Bonus Referral" ? (
                                      <Gift className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                    ) : (
                                      <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                    )
                                  ) : (
                                    <ArrowDownRight className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm md:text-base font-semibold text-[#333] truncate">
                                    {transaction.description}
                                  </p>
                                  <p className="text-xs md:text-sm text-[#8D8D8D] mt-0.5">
                                    {transaction.merchant}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <span className="text-xs text-[#8D8D8D] px-2 py-0.5 bg-gray-100 rounded-full">
                                      {transaction.category}
                                    </span>
                                    <span className="text-xs text-[#8D8D8D]">
                                      {formatDate(transaction.date)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p
                                  className={`text-base md:text-lg lg:text-xl font-bold ${
                                    transaction.type === "earning"
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {transaction.type === "earning" ? "+" : ""}
                                  {transaction.amount.toLocaleString("id-ID")}
                                </p>
                                <p className="text-xs text-[#8D8D8D] mt-0.5">Qoin</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </PageContainer>
      </Section>

      {/* Redeem Modal */}
      {showRedeem && (
        <RedeemModal
          balance={qoinBalance}
          onClose={() => {
            setShowRedeem(false);
            fetchTransactions(); // refresh riwayat
          }}
          onSuccess={(newBalance) => {
            setQoinBalance(newBalance);
          }}
        />
      )}
    </>
  );
};

export default QoinPage;
