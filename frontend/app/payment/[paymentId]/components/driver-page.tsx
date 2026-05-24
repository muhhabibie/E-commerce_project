"use client";

import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/format-price";
import FluentChat from "@/components/icons/fluent-chat";
import Store from "@/components/icons/store";
import { MapPin, ShieldCheck, CheckCircle, Package } from "lucide-react";
import useGetUser from "@/hooks/auth/use-get-user";
import Box from "@/components/icons/box";
import Vespa from "@/components/icons/vespa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";
import { useGlobalChat } from "@/hooks/chat/use-global-chat";
import { from, of, Subscription } from "rxjs";
import { concatMap, delay, tap } from "rxjs/operators";

const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false });

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};
interface DriverPageProps {
  merchantName?: string;
  total: number;
  merchantId?: string;
}

interface StepItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  active: boolean;
  idx?: number;
}

const stepItem: Omit<StepItemProps, "active">[] = [
  {
    icon: <Store />,
    title: "Menuju Merchant",
    desc: "Driver sedang menuju lokasi merchant untuk mengambil pesanan",
  },
  {
    icon: <Box />,
    title: "Mengambil Pesanan",
    desc: "Driver sedang mengambil pesanan kamu",
  },
  {
    icon: <Vespa />,
    title: "Dalam Perjalanan",
    desc: "Pesanan kamu sedang diantar",
  },
  {
    icon: <MapPin />,
    title: "Hampir Sampai",
    desc: "Driver akan segera tiba di lokasi kamu",
  },
];

const StepItem = ({ icon, title, desc, active, idx }: StepItemProps) => {
  return (
    <div key={title} className="flex items-start gap-3">
      <div className="flex flex-col justify-center items-center">
        <div
          className={`flex items-center justify-center p-[5px] rounded-full ${
            active ? "text-white bg-primary" : "border-[#E5E7EB] bg-white"
          }`}
        >
          <span className="rounded-full mx-auto size-[25px] flex items-center justify-center">
            {icon}
          </span>
        </div>
        {!!idx && idx < 3 && <div className="h-10 w-px bg-[#E5E7EB]" />}
      </div>
      <div>
        <p className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
          {title}
        </p>
        <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D]">{desc}</p>
      </div>
    </div>
  );
};

import { useAddress } from "@/hooks/address/use-address";

const DriverPage = ({ merchantName, merchantId }: DriverPageProps) => {
  const router = useRouter();
  const { merchant } = useGetMerchantById(merchantId as string);
  const { openChat } = useGlobalChat();
  const { data: userData } = useGetUser();
  const { primaryAddress } = useAddress();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userEmailName = (userData as any)?.data?.email?.split('@')[0] || "John Doe";

  const [items, setItems] = useState<OrderItem[]>([]);
  const [activeSteps, setActiveSteps] = useState<boolean[]>(() =>
    new Array(stepItem.length).fill(false)
  );

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

  const defaultShippingAddress = primaryAddress 
    ? `${primaryAddress.address} (${primaryAddress.recipient} - ${primaryAddress.phone})`
    : guestAddress
    ? `${guestAddress.address} (${guestAddress.recipient} - ${guestAddress.phone})`
    : `Universitas Telkom Jakarta - Kampus Minangkabau, Jl. Minangkabau Barat No.50, RT.1/RW.1, Pasar Manggis, Setiabudi, South Jakarta City, Jakarta 12970 (${userEmailName} - +62-85156473876)`;

  const [shippingAddress, setShippingAddress] = useState<string>(defaultShippingAddress);
  const [orderId, setOrderId] = useState<string>("ORD-1726990776370");

  const merchantLat = merchant?.latitude || -7.9990025;
  const merchantLng = merchant?.longitude || 112.681263;

  const totalPrice = items.reduce(
    (acc, cur) => acc + cur.price * cur.quantity,
    0
  );

  const tipsFee = totalPrice * 0.01;
  const grandTotal = totalPrice + tipsFee + 20000;
  const [showArrivedDialog, setShowArrivedDialog] = useState(false);

  useEffect(() => {
    // Sync if primaryAddress changes (data loaded)
    setShippingAddress(defaultShippingAddress);
  }, [defaultShippingAddress]);

  useEffect(() => {
    try {
      const storedItems = localStorage.getItem("qoin.cart");
      if (storedItems) {
        const parsed = JSON.parse(storedItems) as OrderItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
        }
      }

      // Generate or read dynamic order ID
      let storedOrderId = localStorage.getItem("qoin.currentOrderId");
      if (!storedOrderId) {
        storedOrderId = `ORD-${Math.floor(Date.now() / 1000)}`;
        localStorage.setItem("qoin.currentOrderId", storedOrderId);
      }
      setOrderId(storedOrderId);
    } catch {
      // fall back to mock
    }
  }, []);

  useEffect(() => {
    if (showArrivedDialog) return;

    // Asynchronous and Reactive Programming using RxJS
    const stepsCount = stepItem.length;
    
    // Higher-Order Function (HOF) to generate the state updater function
    const createStepUpdater = (targetIndex: number) => (prevState: boolean[]) => {
      const nextState = [...prevState];
      nextState[targetIndex] = true;
      return nextState;
    };

    // Create an observable that emits each step index asynchronously with a delay
    const simulation$ = from(Array.from({ length: stepsCount })).pipe(
      // concatMap ensures that the delays happen sequentially (reactive step-by-step transition)
      concatMap((_, index) => of(index).pipe(delay(3000))),
      tap((index) => {
        // Applying the HOF
        setActiveSteps(createStepUpdater(index));

        // If this is the last step, show the arrived dialog
        if (index === stepsCount - 1) {
          setShowArrivedDialog(true);
        }
      })
    );

    const subscription = simulation$.subscribe();

    return () => {
      subscription.unsubscribe(); // Clean up subscription on unmount
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[2fr_minmax(280px,1fr)] lg:gap-6">
      <div className="space-y-4">
        <LeafletMap
          merchantLat={merchantLat}
          merchantLng={merchantLng}
          merchantName={merchant?.name || merchantName || "Merchant"}
        />

        {/* Shipping timeline */}
        <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-5 space-y-4">
          <h2 className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
            Informasi Pengiriman
          </h2>
          <div className="space-y-4">
            {stepItem.map((step, index) => (
              <StepItem
                key={step.title}
                {...step}
                active={activeSteps[index]}
                idx={index}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right: Driver info + order detail */}
      <div className="space-y-4">
        {/* Driver card */}
        <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-4 space-y-4">
          <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
            Informasi Driver
          </h3>
          <div className="flex items-center gap-3">
            {/* <div className="h-10 w-10 rounded-full bg-[#E5E7EB]" /> */}
            <Image
              width={40}
              height={40}
              src={"/images/mamat.png"}
              alt="Foto mamat"
              className="rounded-full border-2 border-primary"
            />
            <div className="space-y-0.5">
              <p className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
                Mamat
              </p>
              <p className="text-sm md:text-base lg:text-lg text-[#8D8D8D]">
                4.9 ⭐
              </p>
            </div>
          </div>

          <div className="flex items-center gap-[35px]">
            <div className="bg-[#FFF7ED] p-[15px] rounded-md">
              <Vespa className="text-primary" />
            </div>
            <div className="space-y-1 text-sm md:text-base lg:text-lg text-[#8D8D8D]">
              <p>BI 1234 XYZ</p>
              <p>Honda Beat</p>
            </div>
          </div>
        </div>

        {/* Order details */}
        <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-4 space-y-3">
          <h3 className="text-sm md:text-base lg:text-lg font-semibold text-[#333]">
            Detail Pesanan
          </h3>
          <div className="space-y-1 text-sm md:text-base lg:text-lg text-[#8D8D8D]">
            <p>ID Pesanan</p>
            <p className="text-[#333] font-medium">{orderId}</p>
          </div>
          <div className="space-y-1 text-sm md:text-base lg:text-lg text-[#8D8D8D]">
            <p>Alamat Pengiriman</p>
            <p className="leading-relaxed">{shippingAddress}</p>
          </div>
          <div className="my-2 h-px bg-[#F3F4F6]" />

          <div className="space-y-1 text-sm md:text-base lg:text-lg text-[#333]">
            {items.map((it, idx) => (
              <div key={`${it.id || it.name}-${idx}`} className="flex items-center justify-between">
                <span>
                  {it.quantity}x {it.name}
                </span>
                <span>Rp {formatPrice(it.price * it.quantity)}</span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#8D8D8D]">Biaya Pengiriman</span>
              <span>Rp {formatPrice(20000)}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[#8D8D8D]">Biaya Layanan (1%)</span>
              <span>Rp {formatPrice(tipsFee)}</span>
            </div>
          </div>

          <div className="my-2 h-px bg-[#F3F4F6]" />

          <div className="flex items-center justify-between text-sm md:text-base lg:text-lg">
            <span className="text-[#8D8D8D]">Total</span>
            <span className="font-bold text-[#333]">
              Rp {formatPrice(grandTotal)}
            </span>
          </div>
        </div>

        {/* Merchant info (dummy) */}
        <div className="rounded-[24px] border border-[#F0F0F0] bg-white p-4 text-sm md:text-base lg:text-lg flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#333] flex items-center gap-2">
              <Store className="w-4 h-4 text-primary" />
              {merchantName}
            </p>
            <p 
              onClick={() => {
                if (merchantId) {
                  if (window.innerWidth >= 768) {
                    openChat(merchantId);
                  } else {
                    router.push(`/chat/${merchantId}`);
                  }
                } else {
                  toast.error("ID Merchant tidak ditemukan.");
                }
              }}
              className="text-primary mt-1 cursor-pointer flex items-center gap-1 hover:underline"
            >
              <FluentChat className="w-4 h-4 text-primary" />
              Hubungi Merchant
            </p>
          </div>
        </div>

        {/* Safety info */}
        <div className="rounded-[24px] border border-primary bg-[#FFF7ED] p-4 text-sm md:text-base lg:text-lg flex items-center justify-between">
          <div>
            <p className="font-semibold text-[#333] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Keamanan Terjamin
            </p>
            <p className="text-[#8D8D8D] mt-1">
              Driver terverifikasi & asuransi perjalanan aktif
            </p>
          </div>
          <button 
            onClick={() => toast.info("Customer Support Qoin: Driver Mamat sedang meluncur ke lokasi Anda. Kami menjamin pesanan tiba tepat waktu!")}
            className="mt-2 rounded-full border border-primary px-4 py-1 text-sm md:text-base lg:text-lg font-semibold text-primary bg-white hover:bg-primary/5 transition-colors"
          >
            Butuh Bantuan?
          </button>
        </div>
      </div>

      <Dialog open={showArrivedDialog} onOpenChange={setShowArrivedDialog}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl md:text-2xl font-bold text-[#333]">
              Pesanan kamu sudah sampai! 🎉
            </DialogTitle>
            <DialogDescription className="mt-3 text-sm md:text-base text-[#8D8D8D] leading-relaxed">
              Terima kasih sudah berbelanja dengan Qoin. Semoga kamu puas dengan
              pesanan dan pelayanannya. Jangan lupa beri rating dan ulasan untuk
              mendukung UMKM favoritmu.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="w-full rounded-full bg-primary hover:bg-primary/90 py-3 md:py-3.5 text-sm md:text-base font-semibold text-white transition-colors duration-200"
              onClick={() => {
                setShowArrivedDialog(false);
                router.push(`/payment/${merchantName}/rating`);
              }}
            >
              Beri Rating & Ulasan
            </button>
            <button
              className="w-full rounded-full border-2 border-[#E5E7EB] hover:border-primary hover:text-primary py-3 md:py-3.5 text-sm md:text-base font-semibold text-[#333] transition-colors duration-200"
              onClick={() => {
                try {
                  localStorage.removeItem("orderStatus");
                  localStorage.removeItem("qoin.cart");
                  localStorage.removeItem("grandTotal");
                } catch (err) {
                  console.log(err);
                }

                setShowArrivedDialog(false);
                router.push("/");
              }}
            >
              Lewati
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DriverPage;
