"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import useGetUser from "@/hooks/auth/use-get-user";
import axiosInstance from "@/lib/axios";
import Image from "next/image";
import {
  Bell,
  MessageSquare,
  Store,
  Gift,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCheck,
  Check,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ── Tipe data conversation dari API ──────────────────────────────────────
interface Conversation {
  partnerId: string;
  partnerEmail?: string;
  partnerName?: string;
  partnerAvatar?: string | null;
  merchantId?: string | null;
  unreadCount: number;
  lastMessage: {
    text: string;
    created_at: string | Date;
    isMine: boolean;
    is_read: boolean;
  };
}

// ── Mock data notifikasi sistem (akan diganti dengan API jika ada) ─────────
const systemNotifications = [
  {
    id: "1",
    type: "promo",
    icon: Gift,
    title: "Promo Spesial Akhir Bulan!",
    message: "Hemat hingga 50% di merchant pilihan. Buruan cek sekarang!",
    time: "5 menit yang lalu",
    isRead: false,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    id: "2",
    type: "qoin",
    icon: TrendingUp,
    title: "Qoin Berhasil Ditambahkan",
    message: "Kamu mendapat 500 Qoin dari transaksi di Warung Makan Bu Siti",
    time: "2 jam yang lalu",
    isRead: false,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    id: "3",
    type: "info",
    icon: Bell,
    title: "Update Fitur Terbaru",
    message: "Sekarang kamu bisa chat langsung dengan merchant favorit!",
    time: "1 hari yang lalu",
    isRead: true,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "4",
    type: "reminder",
    icon: AlertCircle,
    title: "Jangan Lewatkan!",
    message: "Promo flash sale dimulai dalam 3 jam lagi",
    time: "3 hari yang lalu",
    isRead: true,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

// ── Format waktu relatif ──────────────────────────────────────────────────
const formatRelativeTime = (date: string | Date): string => {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "Baru saja";
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  if (diffDay < 7) return `${diffDay} hari yang lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
};

const NotificationsPage = () => {
  const router = useRouter();
  const { openModal } = useOpenModal();
  const { data, isLoading: userLoading, isError } = useGetUser();
  const [selectedTab, setSelectedTab] = useState("chat");
  const [mounted, setMounted] = useState(false);

  // State untuk data chat real
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversationsLoading, setConversationsLoading] = useState(true);
  const [conversationsError, setConversationsError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  interface UserPayload {
    name?: string;
    user?: { name?: string };
  }
  const userData: UserPayload | undefined = data as UserPayload | undefined;
  const isAuthenticated = !!userData && !isError;

  // ─── Fetch daftar percakapan dari API ───────────────────────────────
  const fetchConversations = useCallback(async () => {
    setConversationsLoading(true);
    setConversationsError(null);
    try {
      const res = await axiosInstance.get("/api/chat/conversations");
      setConversations(res.data?.data || []);
    } catch {
      setConversationsError("Gagal memuat percakapan. Coba lagi.");
    } finally {
      setConversationsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConversations();
    }
  }, [isAuthenticated, fetchConversations]);

  // Redirect if not authenticated
  if (!userLoading && !isAuthenticated) {
    router.push("/");
    return null;
  }

  if (!mounted) {
    return null;
  }

  const unreadSystemCount = systemNotifications.filter((n) => !n.isRead).length;
  const unreadChatCount = conversations.filter((c) => c.unreadCount > 0).length;

  const handleSystemNotificationClick = (notifId: string) => {
    console.log("Notification clicked:", notifId);
    // TODO: Mark as read and handle click action
  };

  const handleChatClick = (conversation: Conversation) => {
    if (conversation.merchantId) {
      router.push(`/chat/${conversation.merchantId}`);
    }
  };

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-6 md:mt-8 lg:mt-10 min-h-screen pb-10">
        <PageContainer>
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6 md:mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#333] mb-2">
                  Notifikasi
                </h1>
                <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D]">
                  Update terbaru dan pesan dari merchant
                </p>
              </div>
              {selectedTab === "chat" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={fetchConversations}
                  className="rounded-full mt-1"
                  title="Refresh percakapan"
                >
                  <RefreshCw
                    className={`w-4 h-4 text-gray-500 ${
                      conversationsLoading ? "animate-spin" : ""
                    }`}
                  />
                </Button>
              )}
            </div>

            {userLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Card key={idx} className="rounded-3xl shadow-sm">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-4 animate-pulse">
                        <div className="w-12 h-12 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-3 bg-gray-200 rounded w-full" />
                          <div className="h-3 bg-gray-200 rounded w-1/4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Tabs
                defaultValue="chat"
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 md:mb-8 h-auto p-1 bg-gray-100 rounded-2xl">
                  <TabsTrigger
                    value="system"
                    className="rounded-xl text-sm md:text-base font-semibold py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm relative"
                  >
                    <Bell className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Notifikasi Sistem
                    {unreadSystemCount > 0 && (
                      <Badge className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-0 text-xs">
                        {unreadSystemCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger
                    value="chat"
                    className="rounded-xl text-sm md:text-base font-semibold py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm relative"
                  >
                    <MessageSquare className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                    Pesan Chat
                    {unreadChatCount > 0 && (
                      <Badge className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full px-2 py-0 text-xs">
                        {unreadChatCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* System Notifications Tab */}
                <TabsContent value="system" className="space-y-3 md:space-y-4">
                  {systemNotifications.length === 0 ? (
                    <Card className="rounded-3xl shadow-sm">
                      <CardContent className="p-8 md:p-12 text-center">
                        <Bell className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg md:text-xl font-bold text-[#333] mb-2">
                          Belum Ada Notifikasi
                        </h3>
                        <p className="text-sm md:text-base text-[#8D8D8D]">
                          Notifikasi sistem akan muncul di sini
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    systemNotifications.map((notif) => {
                      const IconComponent = notif.icon;
                      return (
                        <Card
                          key={notif.id}
                          onClick={() =>
                            handleSystemNotificationClick(notif.id)
                          }
                          className={`rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer ${
                            !notif.isRead
                              ? "border-2 border-primary/20 bg-orange-50/30"
                              : ""
                          }`}
                        >
                          <CardContent className="p-4 md:p-6">
                            <div className="flex gap-3 md:gap-4">
                              <div
                                className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${notif.iconBg} flex items-center justify-center flex-shrink-0`}
                              >
                                <IconComponent
                                  className={`w-5 h-5 md:w-6 md:h-6 ${notif.iconColor}`}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h3 className="text-sm md:text-base font-bold text-[#333] line-clamp-1">
                                    {notif.title}
                                  </h3>
                                  {!notif.isRead && (
                                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                                  )}
                                </div>
                                <p className="text-xs md:text-sm text-[#8D8D8D] mb-2 line-clamp-2">
                                  {notif.message}
                                </p>
                                <div className="flex items-center gap-1.5 text-xs text-[#8D8D8D]">
                                  <Clock className="w-3 h-3" />
                                  <span>{notif.time}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </TabsContent>

                {/* Chat Tab — Data Real dari API */}
                <TabsContent value="chat" className="space-y-3 md:space-y-4">

                  {/* Loading state */}
                  {conversationsLoading && (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, idx) => (
                        <Card key={idx} className="rounded-3xl shadow-sm">
                          <CardContent className="p-4 md:p-6">
                            <div className="flex gap-3 md:gap-4 animate-pulse">
                              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gray-200 flex-shrink-0" />
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-3 bg-gray-200 rounded w-full" />
                                <div className="h-3 bg-gray-200 rounded w-1/4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Error state */}
                  {!conversationsLoading && conversationsError && (
                    <Card className="rounded-3xl shadow-sm">
                      <CardContent className="p-8 text-center">
                        <p className="text-sm text-red-500 mb-4">{conversationsError}</p>
                        <Button
                          variant="outline"
                          onClick={fetchConversations}
                          className="rounded-2xl"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Coba Lagi
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Empty state */}
                  {!conversationsLoading && !conversationsError && conversations.length === 0 && (
                    <Card className="rounded-3xl shadow-sm">
                      <CardContent className="p-8 md:p-12 text-center">
                        <MessageSquare className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg md:text-xl font-bold text-[#333] mb-2">
                          Belum Ada Pesan
                        </h3>
                        <p className="text-sm md:text-base text-[#8D8D8D]">
                          Chat dengan merchant akan muncul di sini
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Daftar conversation dari API */}
                  {!conversationsLoading &&
                    !conversationsError &&
                    conversations.map((conv) => {
                      const hasUnread = conv.unreadCount > 0;
                      return (
                        <Card
                          key={conv.partnerId}
                          onClick={() => handleChatClick(conv)}
                          className={`rounded-3xl shadow-sm hover:shadow-md transition-all cursor-pointer ${
                            hasUnread
                              ? "border-2 border-primary/20 bg-orange-50/30"
                              : ""
                          }`}
                        >
                          <CardContent className="p-4 md:p-6">
                            <div className="flex gap-3 md:gap-4">
                              {/* Avatar */}
                              <div className="relative flex-shrink-0">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden bg-gray-200">
                                  {conv.partnerAvatar ? (
                                    <Image
                                      src={conv.partnerAvatar}
                                      alt={conv.partnerName ?? "Partner"}
                                      width={56}
                                      height={56}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                      {(conv.partnerName ?? "?")[0].toUpperCase()}
                                    </div>
                                  )}
                                </div>
                                {/* Badge unread count */}
                                {conv.unreadCount > 0 && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                                    {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                                  </div>
                                )}
                              </div>

                              {/* Info percakapan */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <h3 className="text-sm md:text-base font-bold text-[#333] truncate">
                                    {conv.partnerName ?? conv.partnerEmail ?? "Unknown"}
                                  </h3>
                                  {/* Read receipt di list */}
                                  {conv.lastMessage.isMine && (
                                    conv.lastMessage.is_read ? (
                                      <CheckCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                    ) : (
                                      <Check className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    )
                                  )}
                                </div>

                                {/* Preview last message */}
                                <p
                                  className={`text-xs md:text-sm mb-2 line-clamp-1 ${
                                    hasUnread
                                      ? "text-[#333] font-semibold"
                                      : "text-[#8D8D8D]"
                                  }`}
                                >
                                  {conv.lastMessage.isMine ? "Kamu: " : ""}
                                  {conv.lastMessage.text}
                                </p>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-xs text-[#8D8D8D]">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {formatRelativeTime(conv.lastMessage.created_at)}
                                    </span>
                                  </div>
                                  {/* Merchant badge */}
                                  {conv.merchantId && (
                                    <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                      <Store className="w-3 h-3" />
                                      <span>Merchant</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </TabsContent>
              </Tabs>
            )}
          </div>
        </PageContainer>
      </Section>
    </>
  );
};

export default NotificationsPage;
