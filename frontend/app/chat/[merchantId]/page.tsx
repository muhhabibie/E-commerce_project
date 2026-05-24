"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import useGetUser from "@/hooks/auth/use-get-user";
import useChat, { ChatMessage } from "@/hooks/chat/use-chat";
import Image from "next/image";
import {
  ArrowLeft,
  Send,
  Phone,
  MoreVertical,
  Image as ImageIcon,
  Paperclip,
  Wifi,
  WifiOff,
  Loader2,
  CheckCheck,
  Check,
} from "lucide-react";
import axiosInstance from "@/lib/axios";

interface MerchantInfo {
  id: string;
  name: string;
  profile_photo: string;
  user_id: string;
}

// ── Komponen Typing Indicator Bubble (animasi 3 titik) ─────────────────
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1.5">
      <span
        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "0ms" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  </div>
);

// ── Detektor apakah pesan berupa URL gambar ───────────────────────────
const isImage = (text: string) => {
  return (
    text.startsWith("http") &&
    (text.match(/\.(jpeg|jpg|gif|png|webp)/i) != null ||
      text.includes("merchant-media"))
  );
};

const ChatPage = () => {
  const router = useRouter();
  const params = useParams();
  const { openModal } = useOpenModal();
  const { data, isLoading: userLoading, isError } = useGetUser();
  const [mounted, setMounted] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [merchant, setMerchant] = useState<MerchantInfo | null>(null);
  const [merchantLoading, setMerchantLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Debounce typing indicator — stop typing 1.5s setelah user berhenti ketik
  const typingDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── File upload states & refs ───────────────────────────────────────
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageClick = () => {
    if (isUploading) return;
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File gambar terlalu besar. Maksimal 5MB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Mengunggah gambar...");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axiosInstance.post("/api/chat/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = res.data?.data?.url;
      if (imageUrl) {
        toast.success("Gambar berhasil terkirim!", { id: toastId });
        await sendMessage(imageUrl);
      } else {
        toast.error("Gagal mendapatkan URL gambar.", { id: toastId });
      }
    } catch (err) {
      console.error("[chat.upload] upload error:", err);
      toast.error("Gagal mengunggah gambar. Silakan coba lagi.", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const merchantId = params.merchantId as string;

  // ─── User data ───────────────────────────────────────────────────────
  const userData = data as any;
  const currentUserId =
    userData?.data?.id ?? userData?.id ?? userData?.user?.id ?? null;
  const isAuthenticated = !!userData && !isError;

  // ─── Load merchant info untuk mendapatkan merchant.user_id ──────────
  useEffect(() => {
    if (!merchantId) return;
    const fetchMerchant = async () => {
      try {
        const res = await axiosInstance.get(`/api/merchant/${merchantId}`);
        setMerchant(res.data?.data);
      } catch {
        // Tidak fatal
      } finally {
        setMerchantLoading(false);
      }
    };
    fetchMerchant();
  }, [merchantId]);

  const receiverId = merchant?.user_id ?? null;

  // ─── Real-time chat via Supabase Realtime + RxJS Subject ─────────────
  const {
    messages,
    isConnected,
    isLoading: chatLoading,
    isSending,
    error: chatError,
    isPartnerTyping,
    sendMessage,
    sendTyping,
    sendStopTyping,
  } = useChat(currentUserId, receiverId);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping]);

  // ─── Handle input dengan typing indicator ────────────────────────────
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputMessage(e.target.value);

      if (e.target.value.trim()) {
        // Broadcast typing event
        sendTyping();

        // Debounce: stop typing setelah 1.5 detik tidak ketik
        if (typingDebounceRef.current) {
          clearTimeout(typingDebounceRef.current);
        }
        typingDebounceRef.current = setTimeout(() => {
          sendStopTyping();
        }, 1500);
      } else {
        // Input kosong → langsung stop typing
        sendStopTyping();
        if (typingDebounceRef.current) {
          clearTimeout(typingDebounceRef.current);
        }
      }
    },
    [sendTyping, sendStopTyping]
  );

  // ─── Kirim pesan ─────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending) return;
    const text = inputMessage;
    setInputMessage("");
    // Cleanup debounce timer
    if (typingDebounceRef.current) clearTimeout(typingDebounceRef.current);
    await sendMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: string | Date) =>
    new Date(date).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const isMyMessage = (msg: ChatMessage) => msg.sender_id === currentUserId;

  // Redirect jika belum login — placed AFTER all hooks
  if (!userLoading && !isAuthenticated) {
    router.push("/");
    return null;
  }

  if (!mounted) return null;

  // ─── Render ──────────────────────────────────────────────────────────
  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-0 md:mt-2 lg:mt-4 min-h-screen pb-0">
        <PageContainer>
          <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] flex flex-col">

            {/* ── Chat Header ─────────────────────────────────────────── */}
            <Card className="rounded-t-3xl md:rounded-3xl shadow-lg border-b-0 md:border-b sticky top-0 z-10">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.back()}
                      className="rounded-full hover:bg-gray-100 flex-shrink-0"
                    >
                      <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
                    </Button>

                    {/* Avatar merchant */}
                    <div
                      className="relative flex-shrink-0 cursor-pointer"
                      onClick={() => router.push(`/merchant/${merchantId}`)}
                    >
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-200">
                        {merchantLoading ? (
                          <div className="w-full h-full bg-gray-200 animate-pulse" />
                        ) : merchant?.profile_photo ? (
                          <Image
                            src={merchant.profile_photo}
                            alt={merchant.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                            {merchant?.name?.[0]?.toUpperCase() ?? "M"}
                          </div>
                        )}
                      </div>
                      {/* Indikator Supabase Realtime connection */}
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white transition-colors duration-300 ${
                          isConnected ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>

                    {/* Nama & status koneksi / typing indicator */}
                    <div className="flex-1 min-w-0">
                      <h2
                        className="text-sm md:text-base lg:text-lg font-bold text-[#333] truncate cursor-pointer hover:text-primary"
                        onClick={() => router.push(`/merchant/${merchantId}`)}
                      >
                        {merchantLoading ? "Memuat..." : merchant?.name ?? "Merchant"}
                      </h2>
                      <div className="flex items-center gap-1.5 h-4">
                        {isPartnerTyping ? (
                          // Typing indicator di header
                          <p className="text-xs text-primary font-medium animate-pulse">
                            sedang mengetik...
                          </p>
                        ) : isConnected ? (
                          <>
                            <Wifi className="w-3 h-3 text-green-500" />
                            <p className="text-xs text-green-600 font-medium">
                              Terhubung
                            </p>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-3 h-3 text-gray-400" />
                            <p className="text-xs text-gray-400">
                              Menghubungkan ke Supabase...
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-gray-100 hidden md:flex"
                    >
                      <Phone className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ── Messages Area ────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 md:px-6 md:py-6 space-y-3">

              {/* Loading riwayat */}
              {chatLoading && (
                <div className="flex justify-center py-8">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Memuat riwayat chat...</span>
                  </div>
                </div>
              )}

              {/* Error banner */}
              {chatError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl px-4 py-3 text-sm text-center">
                  {chatError}
                </div>
              )}

              {/* Pesan kosong */}
              {!chatLoading && messages.length === 0 && !chatError && (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium">Belum ada pesan</p>
                  <p className="text-xs mt-1 text-center px-4">
                    Mulai percakapan dengan {merchant?.name ?? "merchant"} ini
                  </p>
                </div>
              )}

              {/* Render pesan */}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    isMyMessage(message) ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[75%] md:max-w-[60%] ${
                      isMyMessage(message)
                        ? "bg-primary text-white"
                        : "bg-white text-[#333] border border-gray-200"
                    } rounded-2xl px-4 py-3 shadow-sm`}
                  >
                    {isImage(message.text) ? (
                      <div className="relative rounded-lg overflow-hidden max-w-full my-1">
                        <img
                          src={message.text}
                          alt="Gambar chat"
                          className="w-full h-auto object-cover max-h-60 rounded-lg cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => window.open(message.text, "_blank")}
                        />
                      </div>
                    ) : (
                      <p className="text-sm md:text-base break-words">
                        {message.text}
                      </p>
                    )}
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        isMyMessage(message) ? "justify-end" : "justify-start"
                      }`}
                    >
                      <p
                        className={`text-xs ${
                          isMyMessage(message)
                            ? "text-orange-100"
                            : "text-[#8D8D8D]"
                        }`}
                      >
                        {formatTime(message.created_at)}
                      </p>
                      {/* Read receipt: centang biru untuk pesan kita yang sudah dibaca */}
                      {isMyMessage(message) && (
                        message.is_read ? (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-300" />
                        ) : (
                          <Check className="w-3.5 h-3.5 text-orange-200" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator Bubble */}
              {isPartnerTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            {/* ── Input Area ───────────────────────────────────────────── */}
            <Card className="rounded-b-3xl md:rounded-3xl shadow-lg border-t-0 md:border-t sticky bottom-0">
              <CardContent className="p-3 md:p-4">
                <div className="flex items-end gap-2 md:gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleImageClick}
                    disabled={isUploading}
                    className="rounded-full hover:bg-gray-100 flex-shrink-0 mb-1"
                  >
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-[#8D8D8D]" />
                    ) : (
                      <Paperclip className="w-5 h-5 text-[#8D8D8D]" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleImageClick}
                    disabled={isUploading}
                    className="rounded-full hover:bg-gray-100 flex-shrink-0 mb-1 hidden md:flex"
                  >
                    <ImageIcon className="w-5 h-5 text-[#8D8D8D]" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      id="chat-input"
                      value={inputMessage}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder={
                        isConnected
                          ? "Ketik pesan..."
                          : "Menghubungkan ke server..."
                      }
                      disabled={!isConnected}
                      className="rounded-2xl border-gray-200 focus:border-primary pr-12 py-5 md:py-6 text-sm md:text-base disabled:opacity-60"
                    />
                  </div>
                  <Button
                    id="chat-send-btn"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || !isConnected || isSending}
                    className="rounded-2xl bg-primary hover:bg-primary/90 px-4 md:px-6 py-5 md:py-6 flex-shrink-0 disabled:opacity-50"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </Section>
    </>
  );
};

export default ChatPage;
