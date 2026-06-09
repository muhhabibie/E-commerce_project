"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import useGetUser from "@/hooks/auth/use-get-user";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import useLogout from "@/hooks/auth/use-logout";
import useGetUserStats from "@/hooks/auth/use-get-user-stats";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  LogOut,
  Store,
  Award,
  Heart,
} from "lucide-react";
import DollarCoin from "@/components/icons/dollar-coin";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { Plus, Wallet, CheckCircle2, X } from "lucide-react";
import { formatPrice } from "@/lib/format-price";
import DialogLogoutConfirm from "@/components/shared/dialog-logout-confirm";

const ProfilePage = () => {
  const router = useRouter();
  const { openModal } = useOpenModal();
  const { data, isLoading, isError } = useGetUser();
  const { handleLogout, isPending } = useLogout();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const { stats, isLoading: statsLoading } = useGetUserStats();

  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);
  const [saldo, setSaldo] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  interface UserPayload {
    qoin?: number;
    notifications?: number;
    avatarUrl?: string | null;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    createdAt?: string;
    user?: {
      qoin?: number;
      notifications?: number;
      avatarUrl?: string | null;
      name?: string;
      email?: string;
      phone?: string;
      address?: string;
      createdAt?: string;
    };
  }

  const userData: UserPayload | undefined = data as UserPayload | undefined;
  const isAuthenticated = !!userData && !isError;

  // Redirect if not authenticated
  if (!isLoading && !isAuthenticated) {
    router.push("/");
    return null;
  }

  // API response shape: { data: { id, email, total_point, created_at, role, ... } }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawUser = (userData as any)?.data ?? (userData as any) ?? {};

  useEffect(() => {
    if (rawUser?.balance !== undefined) {
      setSaldo(rawUser.balance);
    }
  }, [rawUser]);

  const qoinBalance: number =
    rawUser?.total_point ?? rawUser?.qoin ?? rawUser?.user?.total_point ?? 0;

  const avatarUrl: string | null =
    rawUser?.avatarUrl ?? rawUser?.profile_photo ?? rawUser?.user?.avatarUrl ?? null;

  // Users table has no "name" column — derive from email
  const userEmail: string =
    rawUser?.email ?? rawUser?.user?.email ?? "";
  const userName: string =
    rawUser?.name ?? rawUser?.user?.name ?? (userEmail ? userEmail.split("@")[0] : "User");

  const userPhone: string =
    rawUser?.phone ?? rawUser?.user?.phone ?? "";
  const userAddress: string =
    rawUser?.address ?? rawUser?.user?.address ?? "";

  // DB column is "created_at", not "createdAt"
  const createdAt: string =
    rawUser?.created_at ?? rawUser?.createdAt ?? rawUser?.user?.created_at ?? "";

  const displayInitial = userName.charAt(0).toUpperCase();
  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "-";

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-6 md:mt-8 lg:mt-10 min-h-screen pb-10">
        <PageContainer>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#333] mb-2">
                Profil Saya
              </h1>
              <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D]">
                Kelola informasi profil kamu untuk kontrol keamanan akun
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-6">
                <Card className="rounded-3xl shadow-md">
                  <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                      <Skeleton className="w-32 h-32 rounded-full mx-auto md:mx-0" />
                      <div className="flex-1 space-y-4">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Profile Card */}
                <Card className="rounded-3xl shadow-md overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 md:px-8 py-6 md:py-8 border-b">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                      {/* Avatar */}
                      <div className="relative group">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                          {avatarUrl ? (
                            <Image
                              src={avatarUrl}
                              alt="Profile"
                              width={128}
                              height={128}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl font-bold text-gray-600">
                              {displayInitial}
                            </div>
                          )}
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                          <Edit2 className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#333] mb-2">
                          {userName}
                        </h2>
                        <p className="text-sm md:text-base text-[#8D8D8D] mb-4">
                          {userEmail}
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-primary/20">
                            <DollarCoin className="w-5 h-5 text-primary" />
                            <span className="text-sm md:text-base font-semibold text-primary">
                              {qoinBalance} Qoin
                            </span>
                          </div>
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-green-200 shadow-sm">
                            <Wallet className="w-4 h-4 text-green-600" />
                            <span className="text-sm md:text-base font-bold text-green-600">
                              Rp {formatPrice(saldo)}
                            </span>
                          </div>
                          <button
                            onClick={() => setShowTopUp(true)}
                            className="flex items-center gap-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-xs md:text-sm font-bold transition-all shadow-md active:scale-95"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Isi Saldo
                          </button>
                          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200">
                            <Calendar className="w-4 h-4 text-[#8D8D8D]" />
                            <span className="text-xs md:text-sm text-[#8D8D8D]">
                              Bergabung {joinDate}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 md:px-8 py-6 md:py-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg md:text-xl font-bold text-[#333]">
                        Informasi Personal
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="gap-2 rounded-full border-primary text-primary hover:bg-primary/5"
                      >
                        <Edit2 className="w-4 h-4" />
                        {isEditing ? "Batal" : "Edit"}
                      </Button>
                    </div>

                    <div className="space-y-5 md:space-y-6">
                      {/* Name Field */}
                      <div className="space-y-2">
                        <Label className="text-sm md:text-base font-semibold text-[#333] flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          Nama Lengkap
                        </Label>
                        {isEditing ? (
                          <Input
                            defaultValue={userName}
                            className="rounded-2xl border-[#E5E7EB] focus:border-primary text-sm md:text-base"
                          />
                        ) : (
                          <p className="text-sm md:text-base text-[#8D8D8D] pl-6">
                            {userName}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div className="space-y-2">
                        <Label className="text-sm md:text-base font-semibold text-[#333] flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email
                        </Label>
                        {isEditing ? (
                          <Input
                            type="email"
                            defaultValue={userEmail}
                            className="rounded-2xl border-[#E5E7EB] focus:border-primary text-sm md:text-base"
                          />
                        ) : (
                          <p className="text-sm md:text-base text-[#8D8D8D] pl-6">
                            {userEmail || "Belum ada email"}
                          </p>
                        )}
                      </div>

                      {/* Phone Field */}
                      <div className="space-y-2">
                        <Label className="text-sm md:text-base font-semibold text-[#333] flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Nomor Telepon
                        </Label>
                        {isEditing ? (
                          <Input
                            type="tel"
                            defaultValue={userPhone}
                            placeholder="Masukkan nomor telepon"
                            className="rounded-2xl border-[#E5E7EB] focus:border-primary text-sm md:text-base"
                          />
                        ) : (
                          <p className="text-sm md:text-base text-[#8D8D8D] pl-6">
                            {userPhone || "Belum ada nomor telepon"}
                          </p>
                        )}
                      </div>

                      {/* Address Field */}
                      <div className="space-y-2">
                        <Label className="text-sm md:text-base font-semibold text-[#333] flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Alamat
                        </Label>
                        {isEditing ? (
                          <Input
                            defaultValue={userAddress}
                            placeholder="Masukkan alamat lengkap"
                            className="rounded-2xl border-[#E5E7EB] focus:border-primary text-sm md:text-base"
                          />
                        ) : (
                          <p className="text-sm md:text-base text-[#8D8D8D] pl-6">
                            {userAddress || "Belum ada alamat"}
                          </p>
                        )}
                      </div>

                      {isEditing && (
                        <div className="flex gap-3 pt-4">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                            className="flex-1 rounded-full border-2 border-[#E5E7EB] hover:border-primary hover:text-primary"
                          >
                            Batal
                          </Button>
                          <Button
                            onClick={() => {
                              // TODO: Implement save functionality
                              setIsEditing(false);
                            }}
                            className="flex-1 rounded-full bg-primary hover:bg-primary/90 text-white"
                          >
                            Simpan Perubahan
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Transaksi */}
                  <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-5 md:p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Store className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        {statsLoading ? (
                          <Skeleton className="h-8 w-12 mb-1" />
                        ) : (
                          <p className="text-2xl md:text-3xl font-bold text-[#333]">
                            {stats.transactionCount}
                          </p>
                        )}
                        <p className="text-xs md:text-sm text-[#8D8D8D]">Transaksi</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* UMKM Favorit */}
                  <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-5 md:p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        {statsLoading ? (
                          <Skeleton className="h-8 w-12 mb-1" />
                        ) : (
                          <p className="text-2xl md:text-3xl font-bold text-[#333]">
                            {stats.followedCount}
                          </p>
                        )}
                        <p className="text-xs md:text-sm text-[#8D8D8D]">UMKM Favorit</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ulasan Diberikan */}
                  <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-5 md:p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        {statsLoading ? (
                          <Skeleton className="h-8 w-12 mb-1" />
                        ) : (
                          <p className="text-2xl md:text-3xl font-bold text-[#333]">
                            {stats.ratingCount}
                          </p>
                        )}
                        <p className="text-xs md:text-sm text-[#8D8D8D]">Ulasan Diberikan</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card className="rounded-3xl shadow-md border-2 border-red-100">
                  <CardContent className="p-5 md:p-6">
                    <h3 className="text-base md:text-lg font-bold text-[#333] mb-4">
                      Pengaturan Akun
                    </h3>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/user/merchant")}
                        className="w-full justify-start rounded-2xl border-[#E5E7EB] hover:border-primary hover:bg-primary/5 text-left"
                      >
                        <Store className="w-5 h-5 mr-3 text-primary" />
                        <span className="text-sm md:text-base">Toko Saya</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsLogoutOpen(true)}
                        disabled={isPending}
                        className="w-full justify-start rounded-2xl border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="text-sm md:text-base">
                          Keluar dari Akun
                        </span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </PageContainer>
      </Section>
      {showTopUp && (
        <TopUpModal
          onClose={() => setShowTopUp(false)}
          onSuccess={(newBalance) => setSaldo(newBalance)}
        />
      )}
      <DialogLogoutConfirm
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        isPending={isPending}
      />
    </>
  );
};

/* ─── TopUp Modal ──────────────────────────────────────────── */
interface TopUpModalProps {
  onClose: () => void;
  onSuccess: (newBalance: number) => void;
}

const TOPUP_PRESETS = [20000, 50000, 100000, 200000, 500000];

const TopUpModal = ({ onClose, onSuccess }: TopUpModalProps) => {
  const [amount, setAmount] = useState(50000);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{ balance: number } | null>(null);

  const handleTopUp = async () => {
    if (amount <= 0) return;
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post("/api/auth/user/top-up", { amount });
      const data = res.data?.data;
      setResult(data);
      setDone(true);
      onSuccess(data.balance);
      
      // Update cached user in localStorage
      const cached = localStorage.getItem("user");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const userData = parsed.data || parsed;
          userData.balance = data.balance;
          localStorage.setItem("user", JSON.stringify(parsed));
        } catch {}
      }

      toast.success(`Berhasil melakukan top-up sebesar Rp ${amount.toLocaleString("id-ID")}!`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Gagal melakukan top-up";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden animate-[modalIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)_both]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 via-[#10B981] to-emerald-600 px-6 pt-6 pb-8 text-white">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Isi Saldo Dompet</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-8 h-8 animate-bounce" />
            <div>
              <p className="text-xs opacity-80">Metode Pembayaran Instan</p>
              <p className="text-2xl font-extrabold">Top-Up Saldo</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {done && result ? (
            /* Success State */
            <div className="text-center py-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#333] mb-2">Top-Up Berhasil!</h3>
              <p className="text-[#8D8D8D] text-sm mb-4">
                Saldo Anda telah ditambahkan sebesar
              </p>
              <div className="bg-green-50 rounded-2xl px-6 py-4 mb-4 border border-green-100">
                <p className="text-3xl font-extrabold text-green-600">
                  Rp {amount.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-green-500 mt-1">Total Saldo: Rp {result.balance.toLocaleString("id-ID")}</p>
              </div>
              <p className="text-xs text-[#8D8D8D]">
                Saldo dapat langsung digunakan untuk berbelanja instan di mitra UMKM kami.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full py-3 rounded-full bg-green-500 text-white font-bold hover:bg-green-600 transition-colors"
              >
                Selesai
              </button>
            </div>
          ) : (
            /* Input State */
            <>
              <p className="text-sm text-[#8D8D8D] mb-4">
                Pilih nominal top-up cepat atau ketik sendiri:
              </p>

              {/* Preset chips */}
              <div className="flex gap-2 flex-wrap mb-5">
                {TOPUP_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`px-3.5 py-2 rounded-full text-xs md:text-sm font-semibold border transition-all ${
                      amount === preset
                        ? "bg-green-500 text-white border-green-500 shadow-sm"
                        : "bg-gray-50 text-[#8D8D8D] border-gray-200 hover:border-green-500 hover:text-green-500"
                    }`}
                  >
                    Rp {preset.toLocaleString("id-ID")}
                  </button>
                ))}
              </div>

              {/* Manual input */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rp</span>
                  <input
                    type="number"
                    min={1000}
                    value={amount}
                    onChange={(e) => {
                      setAmount(Math.max(0, Number(e.target.value)));
                    }}
                    className="w-full text-left pl-11 pr-4 text-xl font-bold border-2 border-gray-200 rounded-2xl py-2.5 focus:outline-none focus:border-green-500 transition-colors"
                    placeholder="Ketik nominal..."
                  />
                </div>
              </div>

              <button
                onClick={handleTopUp}
                disabled={amount <= 0 || isSubmitting}
                className="w-full py-3.5 rounded-full bg-green-500 text-white font-bold text-base hover:bg-green-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-green-200"
              >
                {isSubmitting ? "Memproses..." : `Top-Up Sekarang`}
              </button>
            </>
          )}
        </div>

        <style>{`
          @keyframes modalIn {
            from { opacity: 0; transform: scale(0.85) translateY(20px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ProfilePage;
