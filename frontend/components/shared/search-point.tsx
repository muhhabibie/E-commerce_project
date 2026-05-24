"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import SearchNormal from "../icons/search-normalized";
import { Button } from "../ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Send, MapPin, Star, ChevronRight } from "lucide-react";

// Mock merchant data untuk response
const mockMerchants = [
  {
    id: "11dbf850-9b60-4b6a-a9d2-4e0a0e0a2474",
    name: "Al Saladbuah",
    image: "/images/cafe-image.png",
    type: "Toko Kelontong",
    location: "Tebet, Jakarta Selatan",
    rating: "4.8",
    reviews: 124,
    isViral: true,
  },
  {
    id: "2",
    name: "Warung Sembako Rezeki",
    image: "/images/cafe-image.png",
    type: "Toko Kelontong",
    location: "Pancoran, Jakarta Selatan",
    rating: "4.9",
    reviews: 89,
    isViral: true,
  },
  {
    id: "154d88ed-b972-49e9-975c-bd67d0a46036",
    name: "Warteg Pesona Bahari",
    image: "/images/cafe-image.png",
    type: "Toko Kelontong",
    location: "Kuningan, Jakarta Selatan",
    rating: "4.7",
    reviews: 156,
    isViral: true,
  },
];

const quickSuggestions = [
  "Toko kelontong yang lagi viral",
  "Warung makan murah meriah",
  "Kedai kopi aesthetic",
  "Toko roti enak terdekat",
];

interface Message {
  type: "user" | "bot" | "merchants";
  content: string;
  merchants?: typeof mockMerchants;
}

const SearchInput = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      content:
        "Hai! Mau cari UMKM apa hari ini? Ketik atau pilih saran di bawah 👇",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSendMessage = (message?: string) => {
    const textToSend = message || inputValue.trim();
    if (!textToSend) return;

    // Add user message
    setMessages((prev) => [...prev, { type: "user", content: textToSend }]);

    setInputValue("");
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false);

      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          content: `Oke! Aku cariin dulu ya UMKM "${textToSend}" yang paling recommended buat kamu...`,
        },
      ]);

      // Add merchant cards after short delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            type: "merchants",
            content: `Ini dia rekomendasi terbaik yang aku temuin! 🎉`,
            merchants: mockMerchants,
          },
        ]);
      }, 1000);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <form className="w-full max-w-[817px] relative mx-auto mt-[30px]">
        <div className="flex relative items-center gap-4">
          <div className="absolute size-[21px] flex items-center px-[25px]">
            <SearchNormal className=" text-gray-400" />
          </div>
          <Input
            className="pl-[45px] py-[30px] border-2 border-[#E1E1E1] text-[20px] cursor-pointer"
            placeholder="Mulai ketik di sini…"
            onFocus={handleOpen}
            onClick={handleOpen}
            readOnly
          />
        </div>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-[95vw] md:w-[90vw] max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-4 border-b">
            <DialogTitle className="text-lg md:text-xl">
              Qoin Assistant 🤖
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              Cari UMKM favorit kamu dengan bantuan AI
            </DialogDescription>
          </DialogHeader>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                {message.type === "user" ? (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm md:text-base text-white max-w-[85%] md:max-w-[75%]">
                      {message.content}
                    </div>
                  </div>
                ) : message.type === "bot" ? (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm md:text-base text-foreground max-w-[85%] md:max-w-[75%]">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-2.5 text-sm md:text-base text-foreground max-w-[85%] md:max-w-[75%]">
                        {message.content}
                      </div>
                    </div>

                    {/* Merchant Cards */}
                    <div className="space-y-3 pl-2">
                      {message.merchants?.map((merchant) => (
                        <div
                          key={merchant.id}
                          onClick={() => {
                            handleClose();
                            router.push(`/merchant/${merchant.id}`);
                          }}
                          className="bg-white rounded-2xl border-2 border-gray-100 hover:border-primary hover:shadow-md transition-all cursor-pointer overflow-hidden"
                        >
                          <div className="flex gap-3 md:gap-4 p-3 md:p-4">
                            {/* Image */}
                            <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                              <Image
                                src={merchant.image}
                                alt={merchant.name}
                                fill
                                className="object-cover"
                              />
                              {merchant.isViral && (
                                <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                  VIRAL
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm md:text-base font-bold text-[#333] mb-1 truncate">
                                {merchant.name}
                              </h4>
                              <p className="text-xs md:text-sm text-[#8D8D8D] mb-2">
                                {merchant.type}
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-xs md:text-sm font-semibold text-[#333]">
                                    {merchant.rating}
                                  </span>
                                </div>
                                <span className="text-xs text-[#8D8D8D]">
                                  ({merchant.reviews} ulasan)
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-[#8D8D8D]">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">
                                  {merchant.location}
                                </span>
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex items-center">
                              <ChevronRight className="w-5 h-5 text-[#8D8D8D]" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-muted px-4 py-3 text-sm text-foreground">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {messages.length === 1 && (
            <div className="px-4 md:px-6 pb-3">
              <p className="text-xs md:text-sm text-[#8D8D8D] mb-2">
                Saran pencarian:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(suggestion)}
                    className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-primary text-xs md:text-sm text-[#8D8D8D] hover:text-white transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-4 md:px-6 pb-4 md:pb-6 border-t pt-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pertanyaan kamu..."
                className="flex-1 rounded-2xl border-2 border-gray-200 focus:border-primary text-sm md:text-base"
                disabled={isTyping}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="rounded-2xl bg-primary hover:bg-primary/90 px-4 md:px-5"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchInput;
