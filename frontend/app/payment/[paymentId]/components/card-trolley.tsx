"use client";

import Store from "@/components/icons/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import useAddProductToCart from "@/hooks/merchant/use-add-product-to-cart";
import Image from "next/image";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format-price";

type CardTrolleyProps = {
  id: string;
  name: string;
  photo_url: string;
  description?: string;
  price: number;
  quantity: number;
  onInc?: (productId: string) => void;
  onDec?: (productId: string) => void;
};

export const CardTrolleyItem = ({
  id,
  name,
  photo_url,
  price,
  quantity,
  description,
  onInc,
  onDec,
}: CardTrolleyProps) => {
  return (
    <div className="flex gap-3 md:gap-4 mb-4 md:mb-5 pb-4 md:pb-5 border-b last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex-shrink-0 overflow-hidden rounded-2xl w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
        <Image
          className="w-full h-full object-cover"
          width={112}
          height={112}
          src={photo_url}
          alt={`Photo ${name}`}
        />
      </div>
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div className="space-y-1">
          <h1 className="text-sm md:text-base lg:text-lg font-semibold text-[#333] line-clamp-1">
            {name}
          </h1>
          <p className="text-[#8D8D8D] text-xs md:text-sm lg:text-base line-clamp-2 leading-relaxed">
            {description ?? "Ini makanan enak banget asli ga boong"}
          </p>
        </div>
        <div className="flex items-center justify-between mt-2 md:mt-3 gap-3">
          <p className="text-primary text-base md:text-lg lg:text-xl font-bold flex-shrink-0">
            {formatPrice(price)}
          </p>
          <div className="flex items-center gap-2 md:gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-7 h-7 md:w-8 md:h-8 p-0 text-white bg-primary hover:bg-primary/90 hover:text-white border-primary"
              onClick={() => onDec?.(id)}
            >
              -
            </Button>
            <p className="text-sm md:text-base font-medium w-6 md:w-8 text-center">
              {quantity}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full w-7 h-7 md:w-8 md:h-8 p-0 text-white bg-primary hover:bg-primary/90 hover:text-white border-primary"
              onClick={() => onInc?.(id)}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CardTrolley = () => {
  const { paymentId } = useParams();
  const { cart, increment, decrement } = useAddProductToCart();
  const { merchant, isLoading } = useGetMerchantById(paymentId as string);
  const router = useRouter();
  const handleBackToMenu = () => {
    return router.push(`/merchant/${paymentId}`);
  };
  return (
    <Card className="rounded-3xl shadow-md">
      <CardHeader className="px-4 md:px-5 lg:px-6 py-4 md:py-5 border-b">
        <div className="flex gap-2 md:gap-3 items-center">
          <Store className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-primary" />
          {isLoading ? (
            <Skeleton className="w-32 md:w-48 h-4 md:h-5" />
          ) : (
            <p className="text-base md:text-lg lg:text-xl xl:text-[22px] font-bold text-[#333]">
              {merchant?.name}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 md:px-5 lg:px-6 py-5 md:py-6">
        <div className="space-y-0">
          {cart.map((item: CardTrolleyProps) => (
            <CardTrolleyItem
              key={item.id}
              {...item}
              onInc={increment}
              onDec={decrement}
            />
          ))}
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mt-6 md:mt-8 lg:mt-10 pt-5 md:pt-6 border-t">
          <div className="space-y-1">
            <h1 className="text-base md:text-lg lg:text-xl xl:text-[22px] font-bold text-[#333]">
              Masih ada yang mau ditambah?
            </h1>
            <p className="text-xs md:text-sm lg:text-base xl:text-lg font-medium text-[#8D8D8D] leading-relaxed">
              Lihat lagi menu lainnya biar gak ada yang terlewat.
            </p>
          </div>
          <Button
            variant={"outline"}
            className="text-primary border-primary hover:text-primary hover:bg-primary/5 font-bold text-sm md:text-base px-4 md:px-5 py-2 md:py-2.5 flex-shrink-0"
            onClick={handleBackToMenu}
          >
            Tambah Lagi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardTrolley;
