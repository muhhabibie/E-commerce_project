"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import useChat from "@/hooks/chat/use-chat";
import { Loader2, Search, Send, Check, CheckCheck, User, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

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

export function ChatPage({ merchantUserId }: { merchantUserId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch Inbox (Conversations)
  const fetchConversations = useCallback(async () => {
    try {
      const res = await axiosInstance.get("/api/chat/conversations");
      if (res.data?.data) {
        setConversations(res.data.data);
        setFilteredConversations(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    // Poll for new conversations every 10 seconds just in case
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter(c => 
        c.partnerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

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
  } = useChat(merchantUserId, selectedPartnerId);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPartnerTyping]);

  const handlePartnerSelect = async (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    // Mark as read when selected
    try {
      await axiosInstance.patch(`/api/chat/read/${partnerId}`);
      // Refresh inbox to update unread counts
      fetchConversations();
    } catch (e) {
      console.error("Failed to mark read", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isSending || !selectedPartnerId) return;
    const text = inputMessage;
    setInputMessage("");
    await sendMessage(text);
    // Refresh conversations slightly after sending to update "last message"
    setTimeout(fetchConversations, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectedPartner = conversations.find(c => c.partnerId === selectedPartnerId);

  return (
    <div className="h-full flex bg-background p-4 md:p-6 gap-6">
      
      {/* Inbox List (Left Sidebar) */}
      <Card className="w-full md:w-1/3 flex flex-col h-full border-border shadow-sm overflow-hidden flex-shrink-0">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold mb-4">Pesan</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari pelanggan..." 
              className="pl-9 bg-muted/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
              <MessageCircle className="w-12 h-12 mb-4 text-muted" />
              <p>Belum ada pesan</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredConversations.map((conv) => (
                <div 
                  key={conv.partnerId} 
                  className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${selectedPartnerId === conv.partnerId ? 'bg-muted' : ''}`}
                  onClick={() => handlePartnerSelect(conv.partnerId)}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {conv.partnerAvatar ? (
                      <Image src={conv.partnerAvatar} alt={conv.partnerName} fill className="object-cover" sizes="48px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                        {conv.partnerName[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold truncate text-sm ${conv.unreadCount > 0 ? 'text-foreground' : 'text-foreground/80'}`}>
                        {conv.partnerName}
                      </span>
                      {conv.lastMessage && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                          {new Date(conv.lastMessage.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-xs truncate ${conv.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {conv.lastMessage?.text}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Chat View (Right Area) */}
      <Card className="hidden md:flex flex-1 flex-col h-full border-border shadow-sm overflow-hidden">
        {selectedPartnerId ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3 bg-card">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 relative">
                {selectedPartner?.partnerAvatar ? (
                  <Image src={selectedPartner.partnerAvatar} alt={selectedPartner.partnerName} fill className="object-cover" sizes="40px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                    {selectedPartner?.partnerName[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-sm">{selectedPartner?.partnerName}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {isConnected ? (
                    <><span className="w-2 h-2 rounded-full bg-green-500" /> Terhubung</>
                  ) : (
                    <><span className="w-2 h-2 rounded-full bg-gray-400" /> Menghubungkan...</>
                  )}
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 bg-muted/10 overflow-y-auto custom-scrollbar">
              {chatLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === merchantUserId;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted text-foreground rounded-tl-sm'}`}>
                          {msg.text.startsWith("http") && (msg.text.includes("gallery") || msg.text.match(/\.(jpeg|jpg|gif|png|webp)/i)) ? (
                            <img src={msg.text} alt="Attachment" className="max-w-full rounded-md mb-1 cursor-pointer" onClick={() => window.open(msg.text, "_blank")} />
                          ) : (
                            <p className="break-words">{msg.text}</p>
                          )}
                          <div className={`flex items-center gap-1 mt-1 text-[10px] ${isMe ? 'text-primary-foreground/70 justify-end' : 'text-muted-foreground justify-start'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                            {isMe && (msg.is_read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {isPartnerTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted text-muted-foreground rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t bg-card flex items-center gap-2">
              <Input 
                placeholder="Ketik balasan..." 
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  if (e.target.value.trim()) sendTyping();
                  else sendStopTyping();
                }}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={!isConnected}
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || !isConnected || isSending} size="icon">
                {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageCircle className="w-16 h-16 mb-4 text-muted" />
            <p className="text-lg font-medium">Pilih pesan</p>
            <p className="text-sm">Pilih obrolan dari daftar untuk mulai membalas</p>
          </div>
        )}
      </Card>
      
    </div>
  );
}
