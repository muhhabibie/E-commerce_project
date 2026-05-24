"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import axiosInstance from "@/lib/axios";

interface QoinTransaction {
  id: string;
  type: "earning" | "spending";
  description: string;
  amount: number;
  date: string;
  merchant: string;
  category: string;
}

const QoinPage = () => {
  const router = useRouter();
  const { openModal } = useOpenModal();
  const { data, isLoading: userLoading, isError } = useGetUser();
  const [filter, setFilter] = useState<"all" | "earning" | "spending">("all");
  const [transactions, setTransactions] = useState<QoinTransaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);

  interface UserPayload {
    qoin?: number;
    total_point?: number;
    user?: {
      qoin?: number;
      total_point?: number;
    };
  }

  const userData: UserPayload | undefined = data as UserPayload | undefined;
  const isAuthenticated = !!userData && !isError;

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/user/qoin-transactions");
        setTransactions(res.data?.data || []);
      } catch (err) {
        console.error("Gagal mengambil riwayat transaksi Qoin:", err);
      } finally {
        setTransactionsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchTransactions();
    }
  }, [isAuthenticated]);

  // Redirect if not authenticated
  if (!userLoading && !isAuthenticated) {
    router.push("/");
    return null;
  }

  const qoinBalance = userData?.total_point ?? userData?.user?.total_point ?? userData?.qoin ?? userData?.user?.qoin ?? 0;

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
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
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
                        <p className="text-sm md:text-base opacity-90 mb-2">
                          Total Qoin
                        </p>
                        <div className="flex items-center gap-3">
                          <DollarCoin className="w-10 h-10 md:w-12 md:h-12 text-white" />
                          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold">
                            {qoinBalance}
                          </h2>
                        </div>
                      </div>
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <TrendingUp className="w-8 h-8 md:w-10 md:h-10" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div>
                        <p className="text-xs md:text-sm opacity-75">
                          Setara dengan
                        </p>
                        <p className="text-base md:text-lg font-semibold">
                          Rp {(qoinBalance * 1000).toLocaleString("id-ID")}
                        </p>
                      </div>
                      <button className="px-4 md:px-5 py-2 md:py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-xs md:text-sm font-semibold transition-colors">
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
                        <span className="text-xs md:text-sm text-[#8D8D8D]">
                          Total Diterima
                        </span>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-[#333]">
                        {totalEarned}
                      </p>
                      <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">
                        Qoin
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                          <ArrowDownRight className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-xs md:text-sm text-[#8D8D8D]">
                          Total Digunakan
                        </span>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-[#333]">
                        {totalSpent}
                      </p>
                      <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">
                        Qoin
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl shadow-md hover:shadow-lg transition-shadow">
                    <CardContent className="p-5 md:p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xs md:text-sm text-[#8D8D8D]">
                          Transaksi
                        </span>
                      </div>
                      <p className="text-2xl md:text-3xl font-bold text-[#333]">
                        {transactions.length}
                      </p>
                      <p className="text-xs md:text-sm text-[#8D8D8D] mt-1">
                        Total
                      </p>
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
                          <li>
                            • Belanja di UMKM mitra dan dapatkan 5% cashback
                            Qoin
                          </li>
                          <li>
                            • Tulis review untuk merchant dan dapatkan 25 Qoin
                          </li>
                          <li>• Referral teman baru dan dapatkan 100 Qoin</li>
                          <li>
                            • Ikuti event dan promo spesial untuk bonus Qoin
                          </li>
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
                          Lihat detail perolehan Qoin kamu
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setFilter("all")}
                          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                            filter === "all"
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-[#8D8D8D] hover:bg-gray-200"
                          }`}
                        >
                          Semua
                        </button>
                        <button
                          onClick={() => setFilter("earning")}
                          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                            filter === "earning"
                              ? "bg-green-500 text-white"
                              : "bg-gray-100 text-[#8D8D8D] hover:bg-gray-200"
                          }`}
                        >
                          Masuk
                        </button>
                        <button
                          onClick={() => setFilter("spending")}
                          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-colors ${
                            filter === "spending"
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-[#8D8D8D] hover:bg-gray-200"
                          }`}
                        >
                          Keluar
                        </button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="divide-y">
                      {filteredTransactions.length === 0 ? (
                        <div className="p-8 md:p-12 text-center">
                          <Calendar className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-300 mb-4" />
                          <p className="text-sm md:text-base text-[#8D8D8D]">
                            Belum ada transaksi
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
                                    ) : transaction.category ===
                                      "Bonus Referral" ? (
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
                                  {transaction.amount > 0 ? "+" : ""}
                                  {transaction.amount}
                                </p>
                                <p className="text-xs text-[#8D8D8D] mt-0.5">
                                  Qoin
                                </p>
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
    </>
  );
};

export default QoinPage;
