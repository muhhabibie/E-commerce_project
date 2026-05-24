"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { use } from "react";
import { articles } from "@/content/articles";
import PageContainer from "@/components/shared/page-container";
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import InspiratedItem from "@/components/shared/inspirated-item";

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = use(params);
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = articles
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#FFFCF5]">
      <PageContainer>
        {/* Back Button */}
        <div className="pt-4 md:pt-6 lg:pt-8 pb-3 md:pb-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="gap-1.5 md:gap-2 text-gray-600 hover:text-primary -ml-2 text-xs md:text-sm lg:text-base px-2 md:px-3"
            >
              <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span>Kembali</span>
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-2 md:px-4 lg:px-0">
          <div className="space-y-3 md:space-y-4 lg:space-y-6 mb-4 md:mb-6 lg:mb-8">
            <div className="space-y-2 md:space-y-3 lg:space-y-4">
              <Badge
                variant="secondary"
                className="bg-primary text-white hover:bg-primary/90 text-[10px] md:text-xs lg:text-sm px-2 md:px-3 py-0.5 md:py-1"
              >
                {article.category}
              </Badge>

              <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-extrabold text-secondary leading-tight">
                {article.title}
              </h1>

              <p className="text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 lg:gap-6 text-xs md:text-sm lg:text-base text-gray-600 py-3 md:py-4 border-y border-gray-200">
              <div className="flex items-center gap-1.5 md:gap-2">
                <User className="w-3 h-3 md:w-4 md:h-4" />
                <span className="font-medium truncate max-w-[120px] md:max-w-none">
                  {article.author.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[10px] md:text-xs lg:text-sm">
                  {new Date(article.publishedAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                <span className="text-[10px] md:text-xs lg:text-sm">
                  {article.readTime}
                </span>
              </div>
              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 md:gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Share2 className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline text-xs md:text-sm">
                  Bagikan
                </span>
              </button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-[200px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[500px] rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden mb-6 md:mb-8 lg:mb-12">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-sm md:prose-base lg:prose-lg xl:prose-xl max-w-none mb-8 md:mb-12 lg:mb-16">
            <div className="article-content text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed">
              {article.content.split("\n").map((line, idx) => {
                // Handle headers
                if (line.startsWith("## ")) {
                  return (
                    <h2
                      key={idx}
                      className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-secondary mt-6 md:mt-8 lg:mt-10 mb-3 md:mb-4 lg:mb-6 break-words"
                    >
                      {line.replace("## ", "")}
                    </h2>
                  );
                }
                if (line.startsWith("### ")) {
                  return (
                    <h3
                      key={idx}
                      className="text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-secondary mt-4 md:mt-6 lg:mt-8 mb-2 md:mb-3 lg:mb-4 break-words"
                    >
                      {line.replace("### ", "")}
                    </h3>
                  );
                }
                // Handle empty lines
                if (line.trim() === "") {
                  return <div key={idx} className="h-2 md:h-3" />;
                }
                // Handle regular paragraphs
                return (
                  <p
                    key={idx}
                    className="mb-3 md:mb-4 lg:mb-6 break-words leading-relaxed"
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 md:gap-2 lg:gap-3 pb-6 md:pb-8 lg:pb-12 border-b border-gray-200">
            {article.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] md:text-xs lg:text-sm px-2 md:px-3 lg:px-4 py-1 md:py-1.5 lg:py-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
              >
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Author Info */}
          <div className="flex items-center gap-3 md:gap-4 py-6 md:py-8 lg:py-12">
            <div className="relative w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-primary/10">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[10px] md:text-xs lg:text-sm text-gray-500 mb-0.5 md:mb-1">
                Ditulis oleh
              </p>
              <h4 className="text-base md:text-lg lg:text-xl font-bold text-secondary">
                {article.author.name}
              </h4>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="max-w-7xl mx-auto pt-6 md:pt-8 lg:pt-12 pb-8 md:pb-12 lg:pb-16 xl:pb-20">
            <div className="mb-4 md:mb-6 lg:mb-8 px-2 md:px-4 lg:px-0">
              <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold text-secondary mb-1 md:mb-2">
                Artikel Terkait
              </h2>
              <p className="text-xs md:text-sm lg:text-base xl:text-lg text-gray-600">
                Artikel lainnya yang mungkin kamu suka
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6 px-2 md:px-4 lg:px-0">
              {relatedArticles.map((relatedArticle) => (
                <InspiratedItem
                  key={relatedArticle.id}
                  article={relatedArticle}
                />
              ))}
            </div>
          </div>
        )}
      </PageContainer>
    </div>
  );
}
