import PageContainer from "../shared/page-container";
import Section from "../shared/section";
import ShinyButton from "../shared/shiny-button";
import FluentChat from "../icons/fluent-chat";
import CommentCard from "../shared/comment-card";

const TestimonialSection = () => {
  return (
    <Section className="mt-10 md:mt-12 lg:mt-[58px] lg:!px-0 bg-[linear-gradient(98deg,#FD6700_0%,#FF9501_46.63%,#FF944B_100%)]">
      <PageContainer className="lg:flex pt-8 md:pt-12 lg:pt-[56px] pb-8 md:pb-10 lg:pb-[41px] overflow-hidden px-4 lg:px-0">
        <header className="mb-6 lg:mb-0">
          <div className="mb-3 md:mb-4">
            <FluentChat />
          </div>
          <div className="lg:w-[481px] max-w-full lg:max-w-[481px] text-white space-y-2 md:space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-[80px] font-extrabold leading-tight">
              Apa Kata Mereka 👀
            </h1>
            <p className="text-base md:text-lg lg:text-xl xl:text-[25px] font-semibold leading-relaxed">
              Cerita-cerita seru dari mereka yang udah dukung produk lokal!
            </p>
          </div>
          <ShinyButton className="mt-5 md:mt-6 lg:mt-[30px]">
            Lihat Semua Ulasan
          </ShinyButton>
        </header>
        <article className="space-y-6 md:space-y-8 lg:space-y-10 overflow-hidden shrink-0 mt-6 md:mt-8 lg:mt-0">
          <div className="overflow-hidden">
            <div className="flex shrink-0 gap-4 md:gap-6 lg:gap-8 lg:animate-marquee animate-marquee-sm">
              {Array.from({ length: 10 }).map((_, index) => (
                <CommentCard key={index} />
              ))}
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="flex shrink-0 gap-4 md:gap-6 lg:gap-8 lg:animate-marquee-reverse animate-marquee-sm-reverse">
              {Array.from({ length: 10 }).map((_, index) => (
                <CommentCard key={index} />
              ))}
            </div>
          </div>
        </article>
      </PageContainer>
    </Section>
  );
};

export default TestimonialSection;
