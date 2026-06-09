"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import useChat from "@/hooks/chat/use-chat";
import { useGlobalChat } from "@/hooks/chat/use-global-chat";
import useGetUser from "@/hooks/auth/use-get-user";
import { Loader2, Send, Check, CheckCheck, MessageCircle, X, Minus, Maximize2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Conversation {
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  unreadCount: number;
  lastMessage: {
    text: string;
    created_at: string;
    isMine: boolean;
    is_read: boolean;
  } | null;
}

const GlobalChatWidget = () => {
  const { isOpen, isMinimized, activePartnerId, closeChat, minimizeChat, maximizeChat, openChat } = useGlobalChat();
  const { data: userData } = useGetUser();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentUserId = (userData as any)?.data?.id ?? (userData as any)?.id ?? (userData as any)?.user?.id ?? null;
  const isAuthenticated = !!currentUserId;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [inboxLoading, setInboxLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [partnerInfo, setPartnerInfo] = useState<{ name: string; avatar: string | null } | null>(null);

  // Fetch partner info when activePartnerId changes
  useEffect(() => {
    if (!activePartnerId) {
      setPartnerInfo(null);
      return;
    }
    const found = conversations.find(c => c.partnerId === activePartnerId);
    if (found) {
      setPartnerInfo({
        name: found.partnerName,
        avatar: found.partnerAvatar,
      });
    } else {
      axiosInstance
        .get(`/api/chat/sender-info/${activePartnerId}`)
        .then((res) => {
          if (res.data?.data) {
            setPartnerInfo({
              name: res.data.data.name,
              avatar: res.data.data.avatar,
            });
          }
        })
        .catch((err) => {
          console.error("Failed to fetch partner info", err);
        });
    }
  }, [activePartnerId, conversations]);

  // Fetch Inbox
  const fetchConversations = useCallback(async () => {
    if (!isAuthenticated || !isOpen) return;
    try {
      setInboxLoading(true);
      const res = await axiosInstance.get("/api/chat/conversations");
      if (res.data?.data) {
        setConversations(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setInboxLoading(false);
    }
  }, [isAuthenticated, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchConversations();
    }
  }, [isOpen, fetchConversations]);

  // Hook for active chat
  const {
    messages,
    isConnected,
    isLoading: chatLoading,
    isSending,
    sendMessage,
    isPartnerTyping,
    sendTyping,
    sendStopTyping
  } = useChat(currentUserId, activePartnerId);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping, isMinimized]);

  const handlePartnerSelect = async (partnerId: string) => {
    openChat(partnerId);
    try {
      await axiosInstance.patch(`/api/chat/read/${partnerId}`);
      fetchConversations();
    } catch (e) {
      console.error("Failed to mark read", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending || !activePartnerId) return;
    const text = inputMessage;
    setInputMessage("");
    await sendMessage(text);
    setTimeout(fetchConversations, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isAuthenticated || !isOpen) return null;

  const selectedPartner = conversations.find(c => c.partnerId === activePartnerId);

  return (
    <div className="fixed bottom-0 right-4 z-50 flex flex-col hidden md:flex shadow-2xl rounded-t-xl overflow-hidden bg-background border border-border" style={{ width: '650px', height: isMinimized ? '48px' : '450px', transition: 'height 0.3s ease-in-out' }}>
      
      {/* Header */}
      <div className="h-12 bg-primary text-primary-foreground flex items-center justify-between px-4 cursor-pointer flex-shrink-0" onClick={() => { if (isMinimized) { maximizeChat(); } else { minimizeChat(); } }}>
        <div className="flex items-center gap-2 font-bold">
          <MessageCircle className="w-5 h-5" />
          <span>Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); if (isMinimized) { maximizeChat(); } else { minimizeChat(); } }} className="p-1 hover:bg-white/20 rounded">
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); closeChat(); }} className="p-1 hover:bg-white/20 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isMinimized && (
        <div className="flex flex-1 h-[calc(100%-48px)]">
          {/* Inbox Pane */}
          <div className="w-1/3 border-r border-border flex flex-col bg-muted/20">
            <div className="p-3 border-b border-border">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Cari..." className="pl-8 h-8 text-xs bg-background" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {inboxLoading && conversations.length === 0 ? (
                <div className="p-4 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
              ) : conversations.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">Belum ada chat</div>
              ) : (
                <div className="divide-y divide-border">
                  {conversations.map(conv => (
                    <div 
                      key={conv.partnerId} 
                      onClick={() => handlePartnerSelect(conv.partnerId)}
                      className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${activePartnerId === conv.partnerId ? 'bg-muted' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 relative">
                        {conv.partnerAvatar ? (
                          <Image src={conv.partnerAvatar} alt={conv.partnerName ?? "Partner"} fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-xs">
                            {(conv.partnerName ?? "U")[0]?.toUpperCase() ?? "U"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <span className={`font-semibold text-xs truncate ${conv.unreadCount > 0 ? 'text-foreground' : 'text-foreground/80'}`}>{conv.partnerName}</span>
                        </div>
                        <p className={`text-[10px] truncate mt-0.5 ${conv.unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>{conv.lastMessage?.text}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Pane */}
          <div className="flex-1 flex flex-col bg-background">
            {activePartnerId ? (
              <>
                {/* Chat Header */}
                <div className="p-3 border-b border-border flex items-center gap-3 bg-muted/10 h-[53px]">
                   <span className="font-semibold text-sm truncate">{partnerInfo?.name ?? selectedPartner?.partnerName ?? "Memuat..."}</span>
                   <span className="text-xs flex items-center gap-1 ml-auto text-muted-foreground">
                    {isConnected ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Terhubung</> : <><span className="w-1.5 h-1.5 rounded-full bg-gray-400" /> ...</>}
                   </span>
                </div>

                {/* Messages */}
                <div className="flex-1 p-3 bg-muted/5 overflow-y-auto custom-scrollbar">
                  {chatLoading ? (
                    <div className="flex justify-center items-center h-full"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map(msg => {
                        const isMe = msg.sender_id === currentUserId;
                        return (
                          <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-xl px-3 py-1.5 text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-white border text-foreground rounded-tl-sm'}`}>
                              {msg.text.startsWith("http") && (msg.text.includes("gallery") || msg.text.match(/\.(jpeg|jpg|gif|png|webp)/i)) ? (
                                <img src={msg.text} alt="img" className="max-w-full rounded-md mb-1 cursor-pointer" onClick={() => window.open(msg.text, "_blank")} />
                              ) : (
                                <p className="break-words leading-snug text-xs">{msg.text}</p>
                              )}
                              <div className={`flex items-center gap-1 mt-0.5 text-[9px] ${isMe ? 'text-primary-foreground/70 justify-end' : 'text-muted-foreground justify-start'}`}>
                                {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                {isMe && (msg.is_read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {isPartnerTyping && (
                        <div className="flex justify-start">
                          <div className="bg-white border rounded-xl rounded-tl-sm px-3 py-2 flex gap-1 items-center">
                            <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Input Area */}
                <div className="p-3 border-t border-border bg-background flex items-center gap-2">
                  <Input 
                    placeholder="Tulis pesan..." 
                    className="h-9 text-xs flex-1 rounded-full bg-muted/50"
                    value={inputMessage}
                    onChange={(e) => {
                      setInputMessage(e.target.value);
                      if (e.target.value.trim()) sendTyping();
                      else sendStopTyping();
                    }}
                    onKeyPress={handleKeyPress}
                    disabled={!isConnected}
                  />
                  <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || !isConnected || isSending} size="icon" className="h-9 w-9 rounded-full">
                    {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3 h-3" />}
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                <MessageCircle className="w-12 h-12 mb-3 text-muted" />
                <p>Pilih chat untuk memulai</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalChatWidget;
