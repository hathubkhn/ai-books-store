"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";
import BookGrid from "@/components/books/BookGrid";
import CategoryCard from "@/components/category/CategoryCard";
import LearningJourney from "@/components/marketing/LearningJourney";
import { Book, Category } from "@prisma/client";

interface HomePageClientProps {
  categories: (Category & { _count?: { books: number } })[];
  featuredBooks: (Omit<Book, "price"> & { price: number; category: Category })[];
}

export default function HomePageClient({ categories, featuredBooks }: HomePageClientProps) {
  const { t } = useLanguage();

  return (
    <main>
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold mb-6 leading-tight">
              {t("heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-foreground-secondary mb-8 max-w-3xl">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/books" className="btn-primary">
                {t("exploreBooks")}
              </Link>
              <Link href="/books" className="btn-secondary">
                {t("viewNewReleases")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap CTA */}
      <section className="section-padding bg-gradient-to-br from-accent-soft to-surface-light">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Không biết nên bắt đầu từ cuốn nào?
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Chọn mục tiêu học tập của bạn, chúng tôi sẽ đề xuất lộ trình và bộ
              sách phù hợp.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { name: "Machine Learning", slug: "machine-learning" },
              { name: "Deep Learning", slug: "deep-learning" },
              { name: "Computer Vision", slug: "computer-vision" },
              { name: "Generative AI", slug: "generative-ai" },
            ].map((track) => (
              <Link
                key={track.slug}
                href={`/roadmap/${track.slug}`}
                className="card hover:shadow-md transition-shadow text-center py-6"
              >
                <p className="font-medium text-sm md:text-base">{track.name}</p>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/roadmap" className="btn-primary inline-block">
              Xây dựng lộ trình của tôi
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
              Learn AI at Every Stage
            </h2>
            <p className="text-foreground-secondary text-lg">
              From primary school to advanced specialization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="section-padding bg-surface-light">
          <div className="container-custom">
            <div className="mb-12">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
                Selected Books
              </h2>
              <p className="text-foreground-secondary text-lg">
                Curated recommendations for learners at all levels
              </p>
            </div>
            
            <BookGrid books={featuredBooks} />
            
            <div className="text-center mt-12">
              <Link href="/books" className="btn-secondary">
                {t("allBooks")}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Learning Journey */}
      <LearningJourney />

      {/* Why AI Books */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
              Technology Books Don't Have to Be Difficult to Read.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-5xl mx-auto">
            <div>
              <div className="editorial-number">01</div>
              <h3 className="font-serif text-2xl font-semibold mb-3">
                Accurate Knowledge
              </h3>
              <p className="text-foreground-secondary">
                Content is organized from foundational to advanced topics, ensuring learners build a solid understanding at each stage.
              </p>
            </div>

            <div>
              <div className="editorial-number">02</div>
              <h3 className="font-serif text-2xl font-semibold mb-3">
                Age Appropriate
              </h3>
              <p className="text-foreground-secondary">
                Every book has a clearly defined target audience, from primary school students to advanced engineers.
              </p>
            </div>

            <div>
              <div className="editorial-number">03</div>
              <h3 className="font-serif text-2xl font-semibold mb-3">
                Learn by Doing
              </h3>
              <p className="text-foreground-secondary">
                Combine explanation, examples, exercises, and projects to reinforce understanding through practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Computer Vision Feature */}
      <section className="section-padding bg-foreground text-surface-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm uppercase tracking-wider text-accent mb-4">
                Computer Vision
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-semibold mb-6 leading-tight">
                From Pixels to Transformers
              </h2>
              <p className="text-surface-light/80 text-lg mb-8">
                A journey from classical image processing, Convolutional Neural Networks, to Vision Transformers and modern computer vision systems.
              </p>
              <Link href="/books/computer-vision-pixels-transformers" className="inline-block px-6 py-3 bg-accent text-white rounded-sm font-medium hover:bg-accent-hover transition-colors">
                {t("viewBook")}
              </Link>
            </div>
            <div className="lg:justify-self-end">
              <div className="w-full max-w-sm aspect-[3/4] bg-surface/10 rounded-sm" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
