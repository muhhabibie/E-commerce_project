import PageContainer from "@/components/shared/page-container";
import Section from "@/components/shared/section";
import TabsDisplay from "./custom/tabs-display";
import { Merchant } from "@/types";
import type { CartItem } from "@/hooks/merchant/use-add-product-to-cart";

interface MerchantDisplayProps {
  merchant?: Merchant | null;
  handleProduct: (productId: string) => void;
  cart: CartItem[];
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  totals: { totalQty: number; totalPrice: number };
}
const MerchantDisplay = ({
  merchant,
  handleProduct,
  cart,
  increment,
  decrement,
  totals,
}: MerchantDisplayProps) => {
  return (
    <Section className="mt-10 md:mt-24 lg:mt-10">
      <PageContainer>
        <TabsDisplay
          merchant={merchant}
          handleProduct={handleProduct}
          cart={cart}
          increment={increment}
          decrement={decrement}
          totals={totals}
        />
      </PageContainer>
    </Section>
  );
};

export default MerchantDisplay;
