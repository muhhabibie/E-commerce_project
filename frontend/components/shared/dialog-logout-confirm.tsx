"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

interface DialogLogoutConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

const DialogLogoutConfirm = ({
  open,
  onClose,
  onConfirm,
  isPending,
}: DialogLogoutConfirmProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[400px] rounded-3xl p-6 text-center">
        <DialogHeader className="flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-2">
            <LogOut className="w-8 h-8" />
          </div>
          <DialogTitle className="font-extrabold text-xl md:text-2xl text-secondary text-center">
            Yakin ingin keluar?
          </DialogTitle>
          <DialogDescription className="text-sm text-[#8D8D8D] text-center leading-relaxed">
            Kamu perlu masuk kembali nanti untuk dapat berbelanja dan menikmati poin serta saldo di toko UMKM favoritmu.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex flex-row gap-3 w-full justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl border-gray-200 text-secondary hover:bg-gray-50 font-bold py-2.5 cursor-pointer bg-white"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-2xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold py-2.5 border-0 cursor-pointer shadow-sm shadow-red-200 flex items-center justify-center gap-1.5"
          >
            {isPending ? "Keluar..." : "Ya, Keluar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLogoutConfirm;
