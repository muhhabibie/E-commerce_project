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

const ProfilePage = () => {
  const router = useRouter();
  const { openModal } = useOpenModal();
  const { data, isLoading, isError } = useGetUser();
  const { handleLogout, isPending } = useLogout();

  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);

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

  const qoinBalance = userData?.data?.qoin ?? userData?.qoin ?? userData?.user?.qoin ?? 0;
  const avatarUrl = userData?.data?.avatarUrl ?? userData?.avatarUrl ?? userData?.user?.avatarUrl ?? null;
  const userName = userData?.data?.name ?? userData?.name ?? userData?.user?.name ?? "User";
  const userEmail = userData?.data?.email ?? userData?.email ?? userData?.user?.email ?? "";
  const userPhone = userData?.data?.phone ?? userData?.phone ?? userData?.user?.phone ?? "";
  const userAddress = userData?.data?.address ?? userData?.address ?? userData?.user?.address ?? "";
  const createdAt = userData?.data?.createdAt ?? userData?.createdAt ?? userData?.user?.createdAt ?? "";

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
                  <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-5 md:p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Store className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-[#333]">
                          0
                        </p>
                        <p className="text-xs md:text-sm text-[#8D8D8D]">
                          Transaksi
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-5 md:p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-[#333]">
                          0
                        </p>
                        <p className="text-xs md:text-sm text-[#8D8D8D]">
                          UMKM Favorit
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-5 md:p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-bold text-[#333]">
                          0
                        </p>
                        <p className="text-xs md:text-sm text-[#8D8D8D]">
                          Ulasan Diberikan
                        </p>
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
                        onClick={handleLogout}
                        disabled={isPending}
                        className="w-full justify-start rounded-2xl border-red-200 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="text-sm md:text-base">
                          {isPending ? "Keluar..." : "Keluar dari Akun"}
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
    </>
  );
};

export default ProfilePage;
