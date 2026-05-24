"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import BorderButton from "./border-button";
import GoogleIcon from "../icons/google";
import Mail from "../icons/mail";

interface DialogLoginProps {
  open: boolean;
  onClose: () => void;
  openModal: (open: string) => void;
}

const DialogLogin = ({ open, onClose, openModal }: DialogLoginProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <Image
            src={"/logo.svg"}
            width={96}
            height={96}
            alt="Logo"
            className="mx-auto"
          />
          <DialogTitle className="font-bold text-base lg:text-3xl text-secondary text-center">
            Masuk dulu yuk, biar bisa dukung UMKM favoritmu
          </DialogTitle>
        </DialogHeader>
        <BorderButton
          className="lg:w-100 w-70 mx-auto text-sm md:text-md"
          icon={<GoogleIcon />}
        >
          Lanjut dengan google
        </BorderButton>
        <BorderButton
          onClick={() => openModal("signin")}
          className="lg:w-100 w-70 mx-auto text-sm md:text-base"
          icon={<Mail />}
        >
          Lanjut dengan email
        </BorderButton>
        <DialogFooter className="text-center text-xs mt-8 flex !flex-col gap-2">
          Dengan melanjutkan, kamu menyetujui Syarat & Ketentuan kami dan
          mengonfirmasi bahwa kamu telah membaca Kebijakan Privasi dan Cookie
          kami.
          <div className="text-sm">
            Belum punya akun?{" "}
            <button
              type="button"
              onClick={() => openModal("signup")}
              className="text-primary underline underline-offset-4 hover:opacity-90 mx-2 cursor-pointer"
            >
              Daftar
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogLogin;
