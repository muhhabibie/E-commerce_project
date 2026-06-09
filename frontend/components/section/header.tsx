"use client";

import Link from "next/link";
import Image from "next/image";
import LogoIcon from "../icons/logo";
import BorderButton from "../shared/border-button";
import PageContainer from "../shared/page-container";
import PrimaryButton from "../shared/primary-button";
import Section from "../shared/section";
import DollarCoin from "@/components/icons/dollar-coin";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Bell } from "lucide-react";
import useGetUser from "@/hooks/auth/use-get-user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter, usePathname } from "next/navigation";
import useLogout from "@/hooks/auth/use-logout";
import useMessageNotification from "@/hooks/chat/use-message-notification";
import { useEffect, useState } from "react";
import QoinInfoModal from "../shared/qoin-info-modal";
import DialogLogoutConfirm from "../shared/dialog-logout-confirm";

interface HeaderProps {
  openModal?: (open: string) => void;
  isLoading?: boolean;
}
const Header = ({ openModal }: HeaderProps) => {
  const router = useRouter();
  const { data, isError, isLoading: isUserLoading } = useGetUser();
  const { handleLogout, isPending } = useLogout();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  interface UserPayload {
    qoin?: number;
    total_point?: number;
    notifications?: number;
    avatarUrl?: string | null;
    name?: string;
    data?: {
      qoin?: number;
      total_point?: number;
      notifications?: number;
      avatarUrl?: string | null;
      name?: string;
      id?: string;
    };
    user?: {
      qoin?: number;
      total_point?: number;
      notifications?: number;
      avatarUrl?: string | null;
      name?: string;
      id?: string;
    };
  }

  const userData: UserPayload | undefined = data as UserPayload | undefined;
  const isAuthenticated = !!userData && !isError;
  const isHydrating = !userData && !isError && isUserLoading;
  const qoinBalance = userData?.total_point ?? userData?.data?.total_point ?? userData?.user?.total_point ?? userData?.qoin ?? userData?.data?.qoin ?? userData?.user?.qoin ?? 0;
  const avatarUrl = userData?.avatarUrl ?? userData?.data?.avatarUrl ?? userData?.user?.avatarUrl ?? null;
  const baseName = userData?.name ?? userData?.data?.name ?? userData?.user?.name ?? "User";
  const displayInitial = baseName.charAt(0).toUpperCase();

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ambil currentUserId dari userData
  const currentUserId =
    (userData as any)?.id ?? (userData as any)?.data?.id ?? (userData as any)?.user?.id ?? null;

  // Hook notifikasi global — subscribe ke Supabase Realtime untuk pesan masuk
  const pathname = usePathname();
  // Ekstrak merchantId dari path /chat/[merchantId] jika user sedang di halaman chat
  const chatPartnerUserId = null; // Header tidak tahu partner user_id, cukup skip notif saat di /chat/*
  const isOnChatPage = pathname?.startsWith("/chat/");

  const { totalUnreadCount } = useMessageNotification(
    isAuthenticated ? currentUserId : null,
    isOnChatPage ? chatPartnerUserId : null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const showSkeleton = !mounted || isHydrating;
  const showAuth = mounted && isAuthenticated && !isHydrating;

  return (
    <Section className="mx-auto border-b">
      <PageContainer>
        <div className="h-[102px] items-center justify-between hidden lg:flex">
          <Link href={"/"}>
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <LogoIcon />
              </div>
              <h1 className="text-[28px] font-extrabold ">Qoin.in</h1>
            </div>
          </Link>
          <div className="hidden lg:block">
            <ul className="flex gap-[50px] text-lg font-semibold">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/explore"
                  className="hover:text-primary transition-colors"
                >
                  Jelajahi UMKM
                </Link>
              </li>
              <li>
                <Link
                  href="/top-100"
                  className="hover:text-primary transition-colors"
                >
                  Top 100 UMKM
                </Link>
              </li>
            </ul>
          </div>
          <div>
            {showSkeleton ? (
              <div className="flex items-center gap-5">
                <div className="h-12 w-[190px] rounded-2xl border animate-pulse bg-gray-100" />
                <div className="h-10 w-10 rounded-full animate-pulse bg-gray-100" />
                <div className="h-12 w-12 rounded-full animate-pulse bg-gray-100" />
              </div>
            ) : showAuth ? (
              <div className="flex items-center gap-5">
                <button
                  onClick={() => router.push("/qoin")}
                  className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-2 hover:bg-orange-100 hover:border-orange-300 transition-colors cursor-pointer"
                >
                  <div
                    className="grid place-items-center h-9 w-9 rounded-full bg-orange-100"
                    suppressHydrationWarning
                  >
                    <DollarCoin className="text-primary" />
                  </div>
                  <div className="leading-tight">
                    <div className="text-secondary font-semibold">
                      Qoin Saya
                    </div>
                    <div className="text-xl font-bold">{qoinBalance}</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/notifications")}
                  className="relative p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                  {totalUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 grid place-items-center h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] font-semibold">
                      {Math.min(99, totalUnreadCount)}
                    </span>
                  )}
                </button>
                {/* Avatar Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-12 w-12 rounded-full overflow-hidden bg-gray-200 border relative hover:opacity-90 transition-opacity">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt="Profil"
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="h-full w-full grid place-items-center text-sm font-semibold text-gray-600">
                          {displayInitial}
                        </span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => router.push("/user/merchant")}
                    >
                      Toko Saya
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => router.push("/profile")}
                    >
                      Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsLogoutOpen(true)}
                      disabled={isPending}
                    >
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <QoinInfoModal>
                  <BorderButton icon={<DollarCoin />}>Cobain</BorderButton>
                </QoinInfoModal>
                <PrimaryButton
                  className="py-2.5 px-5"
                  onClick={() => openModal && openModal("default")}
                >
                  Masuk
                </PrimaryButton>
              </div>
            )}
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex h-[72px] items-center justify-between lg:hidden">
          <Link href={"/"}>
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9">
                <LogoIcon />
              </div>
              <h1 className="text-2xl font-extrabold">Qoin.in</h1>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {showAuth && (
              <button
                onClick={() => router.push("/qoin")}
                className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-2.5 py-1.5 hover:bg-orange-100 transition-colors"
              >
                <DollarCoin className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-primary">
                  {qoinBalance}
                </span>
              </button>
            )}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger
                aria-label="Open menu"
                className="p-2 rounded-md border"
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative h-8 w-8">
                        <LogoIcon />
                      </div>
                      <span className="text-lg font-extrabold">Qoin.in</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="p-4">
                  <ul className="flex flex-col gap-4 text-base font-semibold">
                    <li>
                      <Link
                        href="/"
                        onClick={() => setIsSheetOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        Beranda
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/explore"
                        onClick={() => setIsSheetOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        Jelajahi UMKM
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/top-100"
                        onClick={() => setIsSheetOpen(false)}
                        className="hover:text-primary transition-colors"
                      >
                        Top 100 UMKM
                      </Link>
                    </li>
                  </ul>
                  <div className="mt-6 flex flex-col gap-3">
                    {showSkeleton ? (
                      <div className="flex items-center justify-between gap-4">
                        <div className="h-12 flex-1 rounded-2xl border animate-pulse bg-gray-100" />
                        <div className="h-10 w-10 rounded-full animate-pulse bg-gray-100" />
                      </div>
                    ) : showAuth ? (
                      <div className="flex items-center justify-between gap-4">
                        <button
                          onClick={() => {
                            setIsSheetOpen(false);
                            router.push("/qoin");
                          }}
                          className="flex items-center gap-3 rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 hover:bg-orange-100 hover:border-orange-300 transition-colors"
                        >
                          <div className="grid place-items-center h-8 w-8 rounded-full bg-orange-100">
                            <DollarCoin className="text-primary" />
                          </div>
                          <div className="leading-tight">
                            <div className="text-secondary text-sm font-semibold">
                              Qoin Saya
                            </div>
                            <div className="text-lg font-bold">
                              {qoinBalance}
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSheetOpen(false);
                            router.push("/notifications");
                          }}
                          className="relative p-2 rounded-full hover:bg-muted transition-colors"
                          aria-label="Notifications"
                        >
                          <Bell className="h-5 w-5" />
                          {totalUnreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 grid place-items-center h-5 w-5 rounded-full bg-orange-500 text-white text-[10px] font-semibold">
                              {Math.min(99, totalUnreadCount)}
                            </span>
                          )}
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 border">
                              {avatarUrl ? (
                                <Image
                                  src={avatarUrl}
                                  alt="Profil"
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full grid place-items-center text-xs text-gray-600 font-semibold">
                                  {displayInitial}
                                </div>
                              )}
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem
                              onClick={() => {
                                setIsSheetOpen(false);
                                router.push("/user/merchant");
                              }}
                            >
                              Toko Saya
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setIsSheetOpen(false);
                                router.push("/profile");
                              }}
                            >
                              Profil
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setIsSheetOpen(false);
                                setIsLogoutOpen(true);
                              }}
                              disabled={isPending}
                            >
                              Keluar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      <>
                        <QoinInfoModal>
                          <BorderButton
                            icon={<DollarCoin />}
                            className="border-primary text-secondary hover:text-secondary hover:bg-white cursor-pointer px-4 py-2 text-base font-semibold"
                          >
                            Cobain
                          </BorderButton>
                        </QoinInfoModal>
                        <PrimaryButton
                          className="py-2 px-4"
                          onClick={() => openModal && openModal("default")}
                        >
                          Masuk
                        </PrimaryButton>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </PageContainer>
      <DialogLogoutConfirm
        open={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        isPending={isPending}
      />
    </Section>
  );
};

export default Header;
