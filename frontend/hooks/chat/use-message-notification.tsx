"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export interface NewMessageNotification {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  created_at: string;
  merchantId?: string | null;
  senderName?: string;
  senderAvatar?: string | null;
}

/**
 * useMessageNotification — Hook global untuk notifikasi pesan baru
 *
 * Dipasang di layout/header sehingga bekerja di semua halaman.
 *
 * Fitur:
 * - Subscribe ke Supabase Realtime untuk pesan masuk ke currentUserId
 * - Saat pesan baru masuk (dari user lain):
 *   1. Tampilkan Sonner toast dengan nama pengirim + preview pesan
 *   2. Tampilkan Browser Notification jika user tidak fokus di tab ini
 * - State `totalUnreadCount` untuk badge di navigasi
 * - Request browser notification permission saat pertama kali
 */
const useMessageNotification = (
  currentUserId: string | null,
  currentChatPartnerId?: string | null // ID partner jika sedang di halaman chat
) => {
  const router = useRouter();
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ─── Request Browser Notification Permission ─────────────────────────
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) return;
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }, []);

  // ─── Tampilkan Browser Notification ─────────────────────────────────
  const showBrowserNotification = useCallback(
    (title: string, body: string, merchantId?: string | null) => {
      if (typeof window === "undefined") return;
      if (!("Notification" in window)) return;
      if (Notification.permission !== "granted") return;
      // Hanya tampilkan jika tab tidak fokus
      if (document.hasFocus()) return;

      const notif = new Notification(title, {
        body,
        icon: "/icon.svg",
        badge: "/icon.svg",
        tag: `chat-${merchantId || "unknown"}`,
      });

      notif.onclick = () => {
        window.focus();
        if (merchantId) {
          router.push(`/chat/${merchantId}`);
        }
        notif.close();
      };
    },
    [router]
  );

  // ─── Fetch unread count dari API ─────────────────────────────────────
  const fetchUnreadCount = useCallback(async () => {
    if (!currentUserId) return;
    try {
      const res = await axiosInstance.get("/api/chat/unread-count");
      setTotalUnreadCount(res.data?.data?.count ?? 0);
    } catch {
      // Tidak fatal
    }
  }, [currentUserId]);

  // ─── Fetch sender info (nama + merchant ID) ──────────────────────────
  const fetchSenderInfo = useCallback(
    async (
      senderId: string
    ): Promise<{ name: string; merchantId: string | null; avatar: string | null }> => {
      try {
        // Gunakan endpoint public /api/chat/sender-info/:userId
        // (tidak butuh auth, return info merchant/user berdasarkan userId pengirim)
        const res = await axiosInstance.get(`/api/chat/sender-info/${senderId}`);
        const info = res.data?.data;
        if (info) {
          return {
            name: info.name ?? "Seseorang",
            merchantId: info.merchantId ?? null,
            avatar: info.avatar ?? null,
          };
        }
      } catch {
        // Fallback jika request gagal
      }
      return { name: "Seseorang", merchantId: null, avatar: null };
    },
    []
  );

  // ─── Subscribe ke Supabase Realtime secara global ────────────────────
  useEffect(() => {
    if (!currentUserId) return;

    // Request permission saat pertama kali
    requestNotificationPermission();

    // Fetch unread count awal
    fetchUnreadCount();

    let isCancelled = false;
    const channelName = `notifications:${currentUserId}`;

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          // Hanya pesan yang ditujukan ke currentUserId
          filter: `receiver_id=eq.${currentUserId}`,
        },
        async (payload) => {
          if (isCancelled) return;

          const newMsg = payload.new as {
            id: string;
            sender_id: string;
            receiver_id: string;
            text: string;
            created_at: string;
          };

          // Jangan tampilkan notifikasi jika sedang chat dengan pengirim ini
          if (newMsg.sender_id === currentChatPartnerId) return;

          // Increment unread count
          setTotalUnreadCount((prev) => prev + 1);

          // Ambil info pengirim
          const senderInfo = await fetchSenderInfo(newMsg.sender_id);

          const previewText =
            newMsg.text.length > 60
              ? newMsg.text.substring(0, 60) + "..."
              : newMsg.text;

          const navigateTo = senderInfo.merchantId
            ? `/chat/${senderInfo.merchantId}`
            : null;

          // ── Sonner Toast Notification ───────────────────────────────
          toast(senderInfo.name, {
            description: previewText,
            duration: 5000,
            icon: "💬",
            action: navigateTo
              ? {
                  label: "Balas",
                  onClick: () => router.push(navigateTo),
                }
              : undefined,
          });

          // ── Browser Notification ────────────────────────────────────
          showBrowserNotification(
            `💬 ${senderInfo.name}`,
            previewText,
            senderInfo.merchantId
          );
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log(
            "[useMessageNotification] Subscribed to global notifications"
          );
        }
      });

    channelRef.current = channel;

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [
    currentUserId,
    currentChatPartnerId,
    requestNotificationPermission,
    fetchUnreadCount,
    fetchSenderInfo,
    showBrowserNotification,
    router,
  ]);

  // ─── Reset unread count untuk conversation tertentu ──────────────────
  const resetUnreadForPartner = useCallback(
    async (partnerId: string) => {
      try {
        await axiosInstance.patch(`/api/chat/read/${partnerId}`);
        // Refresh total count dari API
        await fetchUnreadCount();
      } catch {
        // Tidak fatal
      }
    },
    [fetchUnreadCount]
  );

  return {
    totalUnreadCount,
    fetchUnreadCount,
    resetUnreadForPartner,
  };
};

export default useMessageNotification;
