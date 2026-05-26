"use client";

import { useState } from "react";
import type { OrderStatus } from "@/hooks/payment/use-payment";
import CardExpress from "./card-express";
import CardPayment from "./card-payment";
import CardTotal from "./card-total";
import CardTrolley from "./card-trolley";

const TrolleyPage = ({
  handlePage,
}: {
  handlePage: (page: OrderStatus) => void;
}) => {
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "qris" | "saldo">("bank");

  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="md:space-y-[20px]  space-y-2">
        <CardExpress />
        <CardTrolley />
      </div>
      <div className="md:space-y-[20px] space-y-2">
        <CardPayment selectedMethod={paymentMethod} onChange={setPaymentMethod} />
        <CardTotal handlePage={handlePage} selectedMethod={paymentMethod} />
      </div>
    </div>
  );
};

export default TrolleyPage;
