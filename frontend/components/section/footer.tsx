import { FooterContent, FooterIcons } from "@/content/content";
import LogoIcon from "../icons/logo";
import PageContainer from "../shared/page-container";
import Section from "../shared/section";
import { Card, CardContent } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const HeaderFooter = () => {
  return (
    <div>
      <div className="flex gap-3 w-[304px] items-center">
        <span className="relative lg:size-[54px] size-8 md:size-12">
          <LogoIcon className="" />
        </span>
        <h1 className="text-primary font-extrabold lg:text-[28px] md:text-xl text-lg ">
          Qoin.In
        </h1>
      </div>
      <p className="text-sm md:text-lg lg:text-xl text-[#8D8D8D] font-medium lg:pt-3 lg:pb-[30px] md:pb-[20px] pb-[15px] w-[304px]">
        Temukan merchant favorit mu dan kumpulkan Qoin-nya!
      </p>
      <div className="flex items-center gap-4">
        {FooterIcons.map(({ icon: Icon }, index) => (
          <div
            key={index}
            className="bg-[linear-gradient(81deg,#FD6700_-18.45%,#FF944B_29.81%)] lg:p-2.5 md:p-2 p-1 lg:rounded-[14px] md:rounded-lg rounded-lg"
          >
            <Icon className="text-white" />
          </div>
        ))}
      </div>
    </div>
  );
};

const DesktopContent = ({ className }: { className?: string }) => {
  return (
    <>
      <footer className={`flex justify-between px-0 ${className}`}>
        <HeaderFooter />
        {FooterContent.map((item, idx) => (
          <div key={idx}>
            <h1 className="lg:text-lg text-sm md:text-base font-semibold">
              {item.title}
            </h1>
            <div className="mt-3 space-y-2">
              {item.content.map((contentItem, contentIdx) => (
                <p
                  key={contentIdx}
                  className="text-[#8D8D8D] lg:text-lg text-sm md:text-base"
                >
                  {contentItem}
                </p>
              ))}
            </div>
          </div>
        ))}
      </footer>
    </>
  );
};

const SmallScreenContent = ({ className }: { className?: string }) => {
  return (
    <footer className={className}>
      <HeaderFooter />
      <Accordion type="single" collapsible className="w-full">
        {FooterContent.map((item, idx) => (
          <AccordionItem value={`item-${idx}`} key={idx}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>
              {item.content.map((contentItem, contentIdx) => (
                <p
                  key={contentIdx}
                  className="text-[#8D8D8D] lg:text-lg text-sm md:text-base"
                >
                  {contentItem}
                </p>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </footer>
  );
};

const Footer = () => {
  return (
    <Section className="mt-7.5 !px-0">
      <PageContainer>
        <Card className="rounded-0 border-none shadow-none">
          <CardContent className="lg:px-0  ">
            <DesktopContent className="lg:flex hidden" />
            <SmallScreenContent className="lg:hidden block" />
          </CardContent>
        </Card>
      </PageContainer>
    </Section>
  );
};

export default Footer;
