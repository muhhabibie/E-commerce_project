"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { MapPin, Edit } from "lucide-react";

import useGetUser from "@/hooks/auth/use-get-user";

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
}

import { useAddress } from "@/hooks/address/use-address";

const CardExpress = () => {
  const { data: userData } = useGetUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userEmailName = (userData as any)?.data?.email?.split('@')[0] || "John Doe";

  const { primaryAddress, isLoading, saveAddress: saveAddressToDb } = useAddress();

  const DEFAULT_ADDRESS = {
    recipient: userEmailName,
    phone: "+62-85156473876",
    address: "Universitas Brawijaya Malang",
  };

  const [guestAddress, setGuestAddress] = useState<{recipient: string, phone: string, address: string} | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !userData) {
      const stored = localStorage.getItem("qoin.shippingAddress");
      if (stored) {
        try {
          setGuestAddress(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, [userData]);

  const currentAddress = primaryAddress || guestAddress || DEFAULT_ADDRESS;

  const [isOpen, setIsOpen] = useState(false);
  
  // Temporary form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleOpenEdit = () => {
    setName(currentAddress.recipient);
    setPhone(currentAddress.phone);
    setAddress(currentAddress.address);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      toast.error("Semua kolom harus diisi!");
      return;
    }

    if (userData) {
      // User is logged in, save to DB
      const success = await saveAddressToDb({
        name: "Utama",
        recipient: name,
        phone,
        address,
        is_primary: true,
      });

      if (success) {
        setIsOpen(false);
        toast.success("Alamat pengiriman berhasil diperbarui!");
      } else {
        toast.error("Gagal memperbarui alamat. Silakan coba lagi.");
      }
    } else {
      // Guest user, save to localStorage
      const updated = { recipient: name, phone, address };
      localStorage.setItem("qoin.shippingAddress", JSON.stringify(updated));
      // Temporarily update UI for guest
      setGuestAddress(updated);
      
      setIsOpen(false);
      toast.success("Alamat pengiriman berhasil diperbarui!");
    }
  };

  if (isLoading && userData) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-xl"></div>;
  }

  return (
    <>
      <Card className="border hover:border-primary/20 transition-all duration-200 shadow-sm relative overflow-hidden group">
        <CardHeader className="text-[#8D8D8D]">
          <div className="flex items-center justify-between gap-3">
            <CardTitle className="lg:text-lg text-sm font-bold text-secondary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Alamat Pengiriman
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenEdit}
              className="text-primary hover:text-primary-foreground font-semibold flex items-center gap-1.5 px-3 py-1.5 h-auto text-xs active:scale-[0.95]"
            >
              <Edit className="w-3.5 h-3.5" />
              Ubah Alamat
            </Button>
          </div>
          
          <CardDescription className="text-[#333] lg:text-lg text-sm font-medium leading-relaxed mt-3">
            {currentAddress.address}
          </CardDescription>
          
          <CardFooter className="!px-0 lg:text-lg text-sm font-semibold text-secondary space-x-5 mt-2 border-t border-dashed border-[#F0F0F0] pt-2">
            <p className="font-bold">{currentAddress.recipient}</p>
            <p className="text-[#8D8D8D] font-normal">{currentAddress.phone}</p>
          </CardFooter>
        </CardHeader>
      </Card>

      {/* Modal Dialog Ubah Alamat */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-secondary">
              Ubah Alamat Pengiriman
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-semibold text-secondary">
                Nama Penerima <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Cth: Muhammad Habibi"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm font-semibold text-secondary">
                Nomor Telepon / WA <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                placeholder="Cth: +628123456789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="address" className="text-sm font-semibold text-secondary">
                Alamat Lengkap <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="address"
                rows={3}
                placeholder="Tuliskan nama jalan, nomor rumah, RT/RW, kecamatan, dan kota..."
                className="w-full rounded-md border border-input dark:bg-input/30 px-3 py-2 text-sm outline-none focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 transition-all leading-relaxed resize-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" haptic="light" className="w-full sm:w-auto">
                Batal
              </Button>
            </DialogClose>
            <Button onClick={handleSave} haptic="success" className="w-full sm:w-auto bg-primary text-white">
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CardExpress;
