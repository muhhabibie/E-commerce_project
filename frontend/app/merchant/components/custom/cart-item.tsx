"use client   ";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatPrice } from "@/lib/format-price";

interface CartItemProps {
  id: string;
  name: string;
  photo_url: string;
  price: number;
  quantity: number;
  onInc: () => void;
  onDec: () => void;
}

const CartItem = ({
  name,
  photo_url,
  price,
  quantity,
  onInc,
  onDec,
}: CartItemProps) => {
  return (
    <div className="w-full flex items-center gap-4">
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-muted">
        {photo_url && (
          <Image
            src={photo_url}
            alt={name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        )}
      </div>
      <div className="w-full">
        <h1 className="font-semibold text-sm line-clamp-1">{name}</h1>
        <div className="flex items-center justify-between mt-1">
          <p className="text-primary font-semibold text-sm">
            Rp. {formatPrice(price)}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-3 text-white bg-primary hover:bg-primary hover:text-white"
              onClick={onDec}
            >
              -
            </Button>
            <p className="text-sm w-6 text-center">{quantity}</p>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-3 text-white bg-primary hover:bg-primary hover:text-white"
              onClick={onInc}
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
