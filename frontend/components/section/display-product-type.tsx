import { ProductTypeContent } from "@/content/content";
import ProductSection from "../shared/product-section";
import Section from "../shared/section";
import PageContainer from "../shared/page-container";

const DisplayProductType = () => {
  return (
    <Section>
      <PageContainer className="items-center rounded-[30px] relative">
        <ProductSection
          title="Eksplor yang Sesuai Selera Kamu ✨"
          description="Dari kafe sampai kerajinan, semua UMKM keren siap kamu temuin!"
          products={ProductTypeContent}
        />
      </PageContainer>
    </Section>
  );
};

export default DisplayProductType;
