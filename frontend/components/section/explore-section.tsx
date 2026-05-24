import { DisplayMerchantResponse } from "@/types";
import PageContainer from "../shared/page-container";
import ProductSection from "../shared/product-section";
import Section from "../shared/section";

interface ExploreSectionProps {
  displayMerchant?: DisplayMerchantResponse;
  displayMerchantLoading?: boolean;
}

const ExploreSection = ({
  displayMerchant,
  displayMerchantLoading,
}: ExploreSectionProps) => {
  return (
    <Section>
      <PageContainer>
        <ProductSection
          title="Eksplor UMKM di sekitarmu"
          description="Temuin hidden gem deket rumah kamu"
          isExplore
          displayMerchant={displayMerchant}
          isLoading={displayMerchantLoading}
        />
      </PageContainer>
    </Section>
  );
};

export default ExploreSection;
