import type { Component, ComponentType } from "react";
import { HomeIcon } from "@/components/icons/home";
import Spoon from "@/components/icons/spoon";
import NestedLove from "@/components/icons/nested-love";
import { Instagram, MailIcon, Twitter } from "lucide-react";
import Store from "@/components/icons/store";
import { Briefcase } from "lucide-react";

type ButtonHeroContentType = {
  title: string;
  icon: ComponentType<{ className?: string }>;
};

export const ButtonHeroContent: ButtonHeroContentType[] = [
  {
    title: "Semua",
    icon: HomeIcon,
  },
  {
    title: "Makanan",
    icon: Spoon,
  },
  {
    title: "Toko Kelontong",
    icon: Store,
  },
  {
    title: "Jasa",
    icon: Briefcase,
  },
  {
    title: "Fashion",
    icon: NestedLove,
  },
];

export type ProductTypeContentType = {
  title: string;
  img: string;
};

export const ProductTypeContent: ProductTypeContentType[] = [
  {
    title: "Kafe",
    img: "/images/cafe-image.png",
  },
  {
    title: "Jajanan",
    img: "/images/snack-image.png",
  },
  {
    title: "Hobi",
    img: "/images/hobby-image.png",
  },
  {
    title: "Toko Kelontong",
    img: "/images/mini-market-image.png",
  },
];

type FooterIconsType = {
  icon: ComponentType<{ className?: string }>;
};

export const FooterIcons: FooterIconsType[] = [
  {
    icon: Instagram,
  },
  {
    icon: MailIcon,
  },
  {
    icon: Twitter,
  },
];

export const FooterContent = [
  {
    title: "Qoin.in",
    content: ["Jelajahi UMKM", "Promo & Diskon", "Artikel", "Top 100 UMKM"],
  },
  {
    title: "Untuk Pengguna",
    content: ["Cara Ambil Pesanan", "Cara Pengantaran", "Poin Qoin"],
  },
  {
    title: "Untuk Merchant",
    content: ["Gabung Jadi Merchant", "Panduan Merchant"],
  },
  {
    title: "Bantuan",
    content: ["Pusat Bantuan", "Kebijakan Privasi", "Syarat & Ketentuan"],
  },
];

export interface MerchantProducts {
  id: number;
  title: string;
  price: number;
  rating?: number;
  description?: string;
  img?: string;
}

export const merchantProducts: MerchantProducts[] = [
  {
    id: 1,
    title: "Nasi Goreng Spesial",
    price: 12000,
    rating: 4.5,
    description: "Nasi goreng dengan bumbu spesial dan tambahan telur.",
  },
  {
    id: 2,
    title: "Ayam Goyeng ",
    description:
      "Ayam goyeng garing di luar, juicy di dalam. Simpel tapi nikmatnya nggak sederhana!",
    price: 15000,
    rating: 4.7,
  },
  {
    id: 3,
    title: "Mie Goreng",
    price: 13000,
    rating: 4.6,
    description: "Mie goreng dengan bumbu spesial dan sayuran segar.",
  },
];
