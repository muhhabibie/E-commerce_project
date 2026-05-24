"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BorderButton from "@/components/shared/border-button";
import DollarCoin from "@/components/icons/dollar-coin";
import { Sparkles, Gift, Store, Coins } from "lucide-react";
import PrimaryButton from "./primary-button";

interface QoinInfoModalProps {
  children?: React.ReactNode;
}

const QoinInfoModal = ({ children }: QoinInfoModalProps) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleExplore = () => {
    setOpen(false);
    router.push("/explore");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <BorderButton
            icon={<DollarCoin />}
            className="border-primary text-secondary hover:text-secondary hover:bg-white cursor-pointer px-4 py-2 text-base font-semibold"
          >
            Cobain
          </BorderButton>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-[24px]">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 p-6 sm:p-8">
          <DialogHeader className="mb-6">
            <div className="mx-auto bg-white p-3 rounded-2xl shadow-sm border border-orange-100 mb-4 inline-flex">
              <DollarCoin className="w-10 h-10 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-extrabold text-center text-secondary">
              Apa itu Qoin?
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 mt-2">
              Qoin adalah poin reward eksklusif untuk setiap transaksi kamu di Qoin.in. Bikin belanjamu makin hemat dan untung!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mb-8">
            <div className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-orange-50 shadow-sm transition-all hover:shadow-md">
              <div className="bg-orange-50 p-2 rounded-xl text-primary mt-1">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-secondary text-sm">Dapat Cashback Poin</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Dapatkan koin gratis setiap kali kamu berbelanja produk UMKM favoritmu.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-orange-50 shadow-sm transition-all hover:shadow-md">
              <div className="bg-orange-50 p-2 rounded-xl text-primary mt-1">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-secondary text-sm">Tukar dengan Diskon</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Kumpulkan Qoin dan gunakan sebagai potongan harga di transaksi selanjutnya.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white p-4 rounded-2xl border border-orange-50 shadow-sm transition-all hover:shadow-md">
              <div className="bg-orange-50 p-2 rounded-xl text-primary mt-1">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-secondary text-sm">Dukung UMKM Lokal</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Makin banyak transaksi, makin besar dukunganmu untuk pertumbuhan UMKM Indonesia.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <PrimaryButton
              className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-base"
              onClick={handleExplore}
            >
              Jelajahi UMKM Sekarang
            </PrimaryButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QoinInfoModal;
