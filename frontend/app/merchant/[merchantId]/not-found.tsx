"use client";

import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import { Button } from "@/components/ui/button";
import Footer from "@/components/section/footer";
import Link from "next/link";
import LogoIcon from "@/components/icons/logo";

const MerchantNotFound = () => {
  return (
    <>
      <Header />
      <Section className="mt-6">
        <PageContainer>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-24 w-24 relative rounded-3xl mb-6">
              <LogoIcon />
            </div>
            <h1 className="text-lg md:text-xl lg:text-2xl font-extrabold text-[#333]">
              Merchant tidak ditemukan
            </h1>
            <p className="mt-2 max-w-md text-sm md:text-base lg:text-lg text-[#8D8D8D]">
              Kami tidak dapat menemukan merchant yang kamu cari. Coba cek
              kembali tautan atau jelajahi daftar UMKM yang tersedia.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link href="/">
                <Button className="w-full sm:w-auto bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)]">
                  Kembali ke Beranda
                </Button>
              </Link>
              <Link href="/merchant/type/Semua">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Jelajahi UMKM
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </Section>
      <Footer />
    </>
  );
};

export default MerchantNotFound;
