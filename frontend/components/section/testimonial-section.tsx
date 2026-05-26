"use client";

import PageContainer from "../shared/page-container";
import Section from "../shared/section";
import ShinyButton from "../shared/shiny-button";
import FluentChat from "../icons/fluent-chat";
import CommentCard from "../shared/comment-card";
import useGetAllRatings, { RatingItem } from "@/hooks/merchant/use-get-all-ratings";

// Fallback data jika database masih kosong
const FALLBACK_RATINGS: RatingItem[] = [
  {
    id: "f1", rate: 5, comment: "Produk sangat berkualitas, packaging rapi dan pengiriman cepat!",
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(), photo_url: null,
    user: { email: "budi.santoso@gmail.com" }, merchant: { name: "Warung Makan Bu Sari", type: "Makanan" },
  },
  {
    id: "f2", rate: 5, comment: "Pelayanan ramah banget, barang sesuai deskripsi. Pasti order lagi!",
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(), photo_url: null,
    user: { email: "siti.rahayu@yahoo.com" }, merchant: { name: "Batik Nusantara", type: "Fashion" },
  },
  {
    id: "f3", rate: 4, comment: "Enak banget! Cocok di lidah, porsi juga pas. Recommended!",
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(), photo_url: null,
    user: { email: "agus.wijaya@mail.com" }, merchant: { name: "Snack Nusantara", type: "Makanan" },
  },
  {
    id: "f4", rate: 5, comment: "Kualitas produk lokal yang gak kalah sama brand luar. Bangga pakai!",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(), photo_url: null,
    user: { email: "dewi.lestari@email.com" }, merchant: { name: "Kerajinan Jawa", type: "Kerajinan" },
  },
  {
    id: "f5", rate: 5, comment: "Pesanan datang tepat waktu, kondisi sempurna. Seller terpercaya!",
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(), photo_url: null,
    user: { email: "rizky.pratama@gmail.com" }, merchant: { name: "Herbal Sehat", type: "Kesehatan" },
  },
  {
    id: "f6", rate: 4, comment: "Lumayan enak, harga juga terjangkau. Support UMKM lokal yuk!",
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(), photo_url: null,
    user: { email: "rina.permata@gmail.com" }, merchant: { name: "Kopi Lokal", type: "Minuman" },
  },
  {
    id: "f7", rate: 5, comment: "Sudah beberapa kali order, selalu memuaskan. Seller responsif!",
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(), photo_url: null,
    user: { email: "farhan.malik@mail.com" }, merchant: { name: "Tempe Bu Yati", type: "Makanan" },
  },
  {
    id: "f8", rate: 5, comment: "Produk lokal berkualitas tinggi, gak perlu beli impor lagi!",
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(), photo_url: null,
    user: { email: "ninda.sari@email.com" }, merchant: { name: "Tenun Lombok", type: "Fashion" },
  },
];

const TestimonialSection = () => {
  const { ratings, isLoading } = useGetAllRatings(40);

  // Gunakan data nyata jika ada, fallback ke dummy jika kosong
  const displayRatings = ratings.length >= 4 ? ratings : FALLBACK_RATINGS;

  // Bagi jadi 2 baris: genap & ganjil
  const row1 = displayRatings.filter((_, i) => i % 2 === 0);
  const row2 = displayRatings.filter((_, i) => i % 2 === 1);

  // Duplikasi untuk marquee infinite
  const row1Loop = [...row1, ...row1];
  const row2Loop = [...row2, ...row2];

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
          {/* Row 1 — marquee kiri */}
          <div className="overflow-hidden">
            <div className="flex shrink-0 gap-4 md:gap-6 lg:gap-8 lg:animate-marquee animate-marquee-sm">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[437px] h-[170px] rounded-2xl bg-white/20 animate-pulse shrink-0"
                    />
                  ))
                : row1Loop.map((r, i) => (
                    <CommentCard
                      key={`r1-${r.id}-${i}`}
                      userEmail={r.user.email}
                      rate={r.rate}
                      comment={r.comment}
                      date={r.created_at}
                      merchantType={r.merchant.type}
                    />
                  ))}
            </div>
          </div>

          {/* Row 2 — marquee kanan (reverse) */}
          <div className="overflow-hidden">
            <div className="flex shrink-0 gap-4 md:gap-6 lg:gap-8 lg:animate-marquee-reverse animate-marquee-sm-reverse">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-[437px] h-[170px] rounded-2xl bg-white/20 animate-pulse shrink-0"
                    />
                  ))
                : row2Loop.map((r, i) => (
                    <CommentCard
                      key={`r2-${r.id}-${i}`}
                      userEmail={r.user.email}
                      rate={r.rate}
                      comment={r.comment}
                      date={r.created_at}
                      merchantType={r.merchant.type}
                    />
                  ))}
            </div>
          </div>
        </article>
      </PageContainer>
    </Section>
  );
};

export default TestimonialSection;
