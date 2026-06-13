import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import QueryProvider from "@/components/shared/QueryProvider";
import GlobalChatWidget from "@/components/shared/global-chat-widget";
import GlobalAuthModals from "@/components/shared/global-auth-modals";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qoin.In",
  description: "Jadi bagian pendukung UMKM Indonesia dengan Qoin.In!",
  icons: "/icon.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable}`}>
      <body className={`antialiased`}>
        <QueryProvider>
          <Toaster position="bottom-right" richColors />
          {children}
          <GlobalChatWidget />
          <GlobalAuthModals />
        </QueryProvider>
      </body>
    </html>
  );
}
