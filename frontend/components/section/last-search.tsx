import PageContainer from "../shared/page-container";
import ProductSection from "../shared/product-section";
import Section from "../shared/section";

const LastSearch = () => {
  return (
    <Section>
      <PageContainer>
        <ProductSection
          title="Berdasarkan Pencarian Terakhir Kamu 🔍"
          description="Dari pencarian terakhirmu, ini pilihan yang mungkin kamu suka."
          isExplore
        />
      </PageContainer>
    </Section>
  );
};

export default LastSearch;
