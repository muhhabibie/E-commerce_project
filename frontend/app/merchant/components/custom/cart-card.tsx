"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CartItem from "./cart-item";
import type { CartItem as Item } from "@/hooks/merchant/use-add-product-to-cart";
import EmptyCard from "./empty-card";
import { Button } from "@/components/ui/button";
import Cart from "@/components/icons/cart";
import { useParams, useRouter } from "next/navigation";

import useGetUser from "@/hooks/auth/use-get-user";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import DialogLogin from "@/components/shared/dialog-login";
import DialogLoginEmail from "@/components/shared/dialog-login-email";

interface CartCardProps {
  className?: string;
  cart: Item[];
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  totals: { totalQty: number; totalPrice: number };
}

const CartCard = ({
  className,
  cart,
  increment,
  decrement,
  totals,
}: CartCardProps) => {
  const { merchantId } = useParams();
  const router = useRouter();
  const { data } = useGetUser();
  const { openModal, defaultModalIsOpen, closeModal, signInIsOpen } =
    useOpenModal();
  const isAuthenticated = !!data;

  const handleToPayment = () => {
    if (!isAuthenticated) {
      console.log("modal opened");
      openModal("default");
      return;
    }
    return router.push(`/payment/${merchantId}`);
  };
  return (
    <>
      <Card className={className}>
        <CardContent className="p-5 md:p-6">
          <CardHeader className="flex items-center justify-between p-0 mb-4">
            <CardTitle className="text-base lg:text-xl font-bold">
              Keranjang
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {totals?.totalQty ?? 0} item
            </p>
          </CardHeader>
          <div className="w-full space-y-3">
            {cart.length === 0 && <EmptyCard />}
            {cart.map((it) => (
              <CartItem
                key={it.id}
                id={it.id}
                name={it.name}
                photo_url={it.photo_url}
                price={it.price}
                quantity={it.quantity}
                onInc={() => increment(it.id)}
                onDec={() => decrement(it.id)}
              />
            ))}
          </div>
          {cart.length > 0 && (
            <Button
              className="font-bold text-base md:text-lg lg:text-xl mt-5 w-full bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] py-5 md:py-6 group relative overflow-hidden flex justify-center items-center"
              onClick={handleToPayment}
            >
              <span className="absolute inset-0 bg-[linear-gradient(79deg,#FD6700_64.73%,#FF944B_114.39%)] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />

              <p className="z-100">Cek Keranjang</p>
              <Cart className="group-hover:translate-x-2 duration-500 transition-all" />
            </Button>
          )}

          {/* {cart.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <span className="font-medium">Total</span>
          <span className="font-bold">
          Rp. {formatPrice(totals.totalPrice)}
          </span>
          </div>
          )} */}
        </CardContent>
      </Card>
      <DialogLogin
        open={defaultModalIsOpen}
        onClose={closeModal}
        openModal={openModal}
      />
      <DialogLoginEmail open={signInIsOpen} onClose={closeModal} />
    </>
  );
};

export default CartCard;
