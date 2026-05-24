import { Card, CardContent } from "../ui/card";
import Coins from "@/components/icons/coins";
import ShoppingBag from "@/components/icons/shopping-bag";
import PageContainer from "./page-container";
import Section from "./section";
import ShinyButton from "./shiny-button";

interface CallingActionProps {
  openModal: (open: string) => void;
}
const CallingAction = ({ openModal }: CallingActionProps) => {
  return (
    <Section className="mt-15">
      <PageContainer>
        <Card className="bg-[linear-gradient(86deg,#FD6700_4.98%,#FF8E0D_48.74%,#FD6700_91.22%)] text-center relative overflow-hidden min-h-[320px] md:min-h-[340px] lg:h-[275px] lg:w-10/11 mx-auto flex items-center justify-center">
          {/* Decorative icons */}
          <div className="pointer-events-none select-none">
            <Coins className="absolute top-0 left-0 w-32 h-32 lg:size-[280px]" />
            <ShoppingBag className="absolute top-0 right-0 w-32 h-32 lg:size-[280px]" />
          </div>
          <CardContent className="text-white relative px-4 py-10 md:px-6 md:py-12 lg:px-8 lg:py-12 w-full">
            <h1 className="text-xl md:text-3xl lg:text-[40px] font-extrabold leading-tight">
              Mulai perjalananmu bareng Qoin.in
            </h1>
            <p className="text-sm md:text-lg lg:text-[22px] font-medium mt-3 md:mt-4 lg:mt-5 px-4 md:px-8 lg:px-12">
              Yuk, jadi bagian dari komunitas yang dukung UMKM lokal!
            </p>
            <ShinyButton
              className="mt-6 md:mt-8 lg:mt-[35px] mb-4 md:mb-0"
              onClick={() => openModal("default")}
            >
              Gabung Sekarang
            </ShinyButton>
          </CardContent>
        </Card>
      </PageContainer>
    </Section>
  );
};

export default CallingAction;
