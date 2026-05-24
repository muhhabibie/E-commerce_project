"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Subject, Subscription } from "rxjs";
import { supabase } from "@/lib/supabase";
import axiosInstance from "@/lib/axios";

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  text: string;
  is_read: boolean;
  created_at: string | Date;
}

/**
 * useChat — Custom hook real-time chat berbasis Supabase Realtime + RxJS Subject
 *
 * Fitur:
 * - Real-time pesan via Supabase postgres_changes
 * - Typing indicator via Supabase Broadcast (ephemeral, tidak simpan ke DB)
 * - Auto mark-as-read saat buka chat dan saat menerima pesan baru
 * - Read receipt state per pesan
 *
 * Arsitektur Reactive:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  User kirim pesan                                           │
 * │      ↓                                                      │
 * │  axiosInstance.post("/api/chat/messages")  [REST]           │
 * │      ↓                                                      │
 * │  Backend simpan ke Supabase DB (Prisma)                     │
 * │      ↓                                                      │
 * │  Supabase Realtime mendeteksi INSERT                        │
 * │      ↓  (WebSocket dari Supabase, bukan server kita)        │
 * │  supabase.channel().on("postgres_changes")                  │
 * │      ↓                                                      │
 * │  messageSubject.next(newMsg)   [RxJS reactive push]         │
 * │      ↓                                                      │
 * │  subscription → setMessages()  [state update]               │
 * │      ↓                                                      │
 * │  React re-render               [UI otomatis terupdate]      │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Typing indicator via Supabase Broadcast:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  User mengetik → sendTyping()                               │
 * │      ↓                                                      │
 * │  channel.send({ type: "broadcast", event: "typing" })       │
 * │      ↓  (tidak tersimpan ke DB, ephemeral)                  │
 * │  Penerima: on("broadcast", event: "typing")                 │
 * │      ↓                                                      │
 * │  setIsPartnerTyping(true)                                   │
 * │      ↓ (auto reset setelah 2 detik tanpa event baru)        │
 * │  setIsPartnerTyping(false)                                  │
 * └─────────────────────────────────────────────────────────────┘
 */
const useChat = (currentUserId: string | null, receiverId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Typing indicator state
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // RxJS Subject sebagai internal reactive event bus
  const messageSubject = useRef(new Subject<ChatMessage>());
  const subscriptionRef = useRef<Subscription | null>(null);

  // Ref ke channel Supabase untuk bisa kirim broadcast typing
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  // ─── Fungsi: Mark as read ──────────────────────────────────────────
  const markAsRead = useCallback(async () => {
    if (!receiverId || !currentUserId) return;
    try {
      await axiosInstance.patch(`/api/chat/read/${receiverId}`);
    } catch {
      // Tidak fatal — mark as read bisa gagal tanpa pengaruh UX
    }
  }, [receiverId, currentUserId]);

  // ─── 1. Subscribe ke RxJS Subject → update state secara reaktif ─────
  useEffect(() => {
    subscriptionRef.current = messageSubject.current.subscribe((msg) => {
      setMessages((prev) => {
        // Idempoten: cegah duplikat berdasarkan ID
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });

      // Auto mark-as-read jika pesan masuk dari partner (bukan dari kita)
      if (msg.sender_id === receiverId) {
        markAsRead();
      }
    });

    return () => {
      subscriptionRef.current?.unsubscribe();
    };
  }, [receiverId, markAsRead]);

  // ─── 2. Load riwayat + Subscribe Supabase Realtime ──────────────────
  useEffect(() => {
    if (!currentUserId || !receiverId) return;

    let isCancelled = false;

    // Load riwayat pesan dari DB via REST API
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get(`/api/chat/history/${receiverId}`);
        const history: ChatMessage[] = res.data?.data || [];
        if (!isCancelled) setMessages(history);

        // Mark pesan dari partner sebagai sudah dibaca setelah load history
        await markAsRead();
      } catch {
        // Tidak fatal — mulai dari kosong
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadHistory();

    // Channel name deterministik — sama persis dengan yang dipakai backend saat broadcast
    const participants = [currentUserId, receiverId].sort().join("_");
    const channelName = `chat:${participants}`;

    // Channel Supabase dipakai untuk:
    // 1. Broadcast "new_message" — dikirim backend setelah simpan ke DB (tidak butuh Replication)
    // 2. Broadcast "typing" / "stop_typing" — ephemeral typing indicator
    const channel = supabase
      .channel(channelName, {
        config: { broadcast: { self: true } }, // terima broadcast dari diri sendiri juga
      })
      // ── Pesan baru via Broadcast dari backend ──
      .on(
        "broadcast",
        { event: "new_message" },
        (payload) => {
          if (!isCancelled) {
            const msg = payload.payload as ChatMessage;
            // Validasi: pesan harus antara currentUser dan receiverId
            const isRelevant =
              (msg.sender_id === currentUserId && msg.receiver_id === receiverId) ||
              (msg.sender_id === receiverId && msg.receiver_id === currentUserId);
            if (!isRelevant) return;
            messageSubject.current.next(msg);
          }
        }
      )
      // ── Typing indicator dari partner ──
      .on(
        "broadcast",
        { event: "typing" },
        (payload) => {
          if (!isCancelled && payload.payload?.sender_id === receiverId) {
            setIsPartnerTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              if (!isCancelled) setIsPartnerTyping(false);
            }, 2500);
          }
        }
      )
      // ── Stop typing dari partner ──
      .on(
        "broadcast",
        { event: "stop_typing" },
        (payload) => {
          if (!isCancelled && payload.payload?.sender_id === receiverId) {
            setIsPartnerTyping(false);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          }
        }
      )
      .subscribe((status) => {
        if (isCancelled) return;
        console.log("[useChat] channel status:", status, channelName);
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          setError(null);
          console.log("[useChat] ✅ Supabase Realtime connected:", channelName);
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setIsConnected(false);
          setError("Gagal terhubung ke Supabase Realtime.");
          console.error("[useChat] ❌ Realtime error:", status);
        } else if (status === "CLOSED") {
          setIsConnected(false);
        }
      });

    channelRef.current = channel;

    return () => {
      isCancelled = true;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      supabase.removeChannel(channel);
      channelRef.current = null;
      setIsConnected(false);
      setIsPartnerTyping(false);
    };
  }, [currentUserId, receiverId, markAsRead]);

  // ─── 3. Kirim pesan via REST API ────────────────────────────────────
  const sendMessage = async (text: string) => {
    if (!text.trim() || !receiverId || isSending) return;

    setIsSending(true);

    // Stop typing indicator sebelum kirim
    sendStopTyping();

    try {
      await axiosInstance.post("/api/chat/messages", {
        receiver_id: receiverId,
        text: text.trim(),
      });
      // Tidak perlu manual push ke Subject di sini —
      // Supabase Realtime akan push balik otomatis setelah INSERT
    } catch {
      setError("Gagal mengirim pesan. Coba lagi.");
    } finally {
      setIsSending(false);
    }
  };

  // ─── 4. Broadcast typing indicator via Supabase Broadcast ────────────
  const sendTyping = useCallback(() => {
    if (!channelRef.current || !currentUserId || !isConnected) return;
    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { sender_id: currentUserId },
    });
  }, [currentUserId, isConnected]);

  const sendStopTyping = useCallback(() => {
    if (!channelRef.current || !currentUserId) return;
    channelRef.current.send({
      type: "broadcast",
      event: "stop_typing",
      payload: { sender_id: currentUserId },
    });
  }, [currentUserId]);

  return {
    messages,
    isConnected,
    isLoading,
    isSending,
    error,
    isPartnerTyping,
    sendMessage,
    sendTyping,
    sendStopTyping,
  };
};

export default useChat;
