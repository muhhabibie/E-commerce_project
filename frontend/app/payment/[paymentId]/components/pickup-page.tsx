"use client";

import type { OrderStatus } from "@/hooks/payment/use-payment";
import CardPayment from "./card-payment";
import CardTotal from "./card-total";
import CardTrolley from "./card-trolley";

const PickupPage = ({ handlePage }: { handlePage: (page: OrderStatus) => void }) => {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="md:space-y-[20px] space-y-2">
        <CardTrolley />
      </div>
      <div className="md:space-y-[20px] space-y-2">
        <CardPayment />
        <CardTotal handlePage={handlePage} isPickup />
      </div>
    </div>
  );
};

export default PickupPage;
