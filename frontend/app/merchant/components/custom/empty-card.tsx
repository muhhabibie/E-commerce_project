import Box from "@/components/icons/box";
import DollarCoin from "@/components/icons/dollar-coin";
import { Button } from "@/components/ui/button";
import { SearchIcon, ShoppingCart } from "lucide-react";

export const IconCartCard = ({
  className,
  icon,
}: {
  className?: string;
  icon: React.ReactNode;
}) => {
  return (
    <div
      className={`bg-[#FFF7ED] rounded-[16px] shadow-[2px_4px_10px_0_rgba(233,109,0,0.4)] absolute  p-2.5 ${className}`}
    >
      {icon}
    </div>
  );
};

const EmptyCard = () => {
  return (
    <div className="text-center mx-auto flex items-center justify-center flex-col">
      <div className="bg-[linear-gradient(86deg,#FD6700_4.98%,#FF944B_94.22%)] flex items-center justify-center rounded-[25px] size-[120px] relative max-w-[330px]">
        <ShoppingCart className="w-12 h-12 text-white" />
        <IconCartCard
          icon={<SearchIcon className="text-[#ED8814]" />}
          className="-left-8"
        />
        <IconCartCard
          icon={<DollarCoin className="text-[#00BF63]" />}
          className="-right-4 bottom-4"
        />
        <IconCartCard
          icon={<DollarCoin className="text-[#ED3437]" />}
          className="-top-4"
        />
      </div>
      <p className="mt-5 font-semibold lg:text-xl ">Keranjangmu masih kosong</p>
      <p className="mt-5 text-xs lg:text-base  text-[#8D8D8D] ">
        Dukung UMKM lokal dengan mulai tambah produk ke keranjangmu!
      </p>
      <Button className="font-bold lg:text-xl mt-4 w-full bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] py-6 group relative overflow-hidden">
        <span className="absolute inset-0 bg-[linear-gradient(79deg,#FD6700_64.73%,#FF944B_114.39%)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />

        <p className="z-100">Cek Menu</p>
        <Box className="group-hover:translate-x-2 duration-500 transition-all" />
      </Button>
    </div>
  );
};

export default EmptyCard;
