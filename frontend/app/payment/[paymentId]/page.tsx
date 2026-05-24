"use client";

import Header from "@/components/section/header";
import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import useOpenModal from "@/hooks/landing-page/use-open-modal";
import usePayment from "@/hooks/payment/use-payment";
import type { OrderStatus } from "@/hooks/payment/use-payment";
import TrolleyPage from "./components/trolley-page";
import PickupPage from "./components/pickup-page";
import PaymentProducts from "./components/payment-page";
import SearchingDriver from "./components/searching-driver";
import PickupConfirmation from "./components/pickup-confirmation";
import useGetMerchantById from "@/hooks/merchant/use-get-merchant-by-id";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import DriverPage from "./components/driver-page";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const PaymentPage = () => {
  const [grandTotal, setGrandTotal] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery"
  );
  const { paymentId } = useParams();
  const { openModal } = useOpenModal();
  const {
    onPaymentPage,
    onDefaultPage,
    handlePage,
    onSearchingPage,
    isSearching,
    onDriverPage,
    onPickupConfirmationPage,
  } = usePayment();

  const { merchant } = useGetMerchantById(paymentId as string);

  useEffect(() => {
    const total = localStorage.getItem("grandTotal");
    setGrandTotal(total);
  }, []);

  return (
    <>
      <Header openModal={openModal} />
      <Section className="mt-6">
        <PageContainer>
          {onDefaultPage && (
            <Tabs
              value={deliveryMethod}
              onValueChange={(v) =>
                setDeliveryMethod(v as "delivery" | "pickup")
              }
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger value="delivery" className="text-base">
                  Diantar
                </TabsTrigger>
                <TabsTrigger value="pickup" className="text-base">
                  Ambil Sendiri
                </TabsTrigger>
              </TabsList>
              <TabsContent value="delivery">
                <TrolleyPage handlePage={handlePage} />
              </TabsContent>
              <TabsContent value="pickup">
                <PickupPage handlePage={handlePage} />
              </TabsContent>
            </Tabs>
          )}
          {onPaymentPage && (
            <div className="mt-10">
              <PaymentProducts
                total={Number(grandTotal)}
                handlePage={handlePage}
                isPickup={deliveryMethod === "pickup"}
              />
            </div>
          )}
          {onSearchingPage && isSearching && deliveryMethod === "delivery" && (
            <SearchingDriver merchantName={merchant?.name || ""} />
          )}
          {onDriverPage && !isSearching && deliveryMethod === "delivery" && (
            <DriverPage
              merchantName={merchant?.name || ""}
              total={Number(grandTotal)}
              merchantId={merchant?.id || (paymentId as string)}
            />
          )}
          {onPickupConfirmationPage && deliveryMethod === "pickup" && (
            <PickupConfirmation
              merchantName={merchant?.name || ""}
              total={Number(grandTotal)}
            />
          )}
        </PageContainer>
      </Section>
    </>
  );
};

export default PaymentPage;
