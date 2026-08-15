import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EarlyBuyerBanner from "@/components/marketing/EarlyBuyerBanner";
import HomePageClient from "./HomePageClient";
import { prisma } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Books - AI Knowledge for Every Generation",
  description: "From a child's first introduction to artificial intelligence to Computer Vision, Deep Learning, and advanced algorithms for university students and engineers.",
};

export default async function HomePage() {
  const [categories, featuredBooksRaw] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { books: true },
        },
      },
    }),
    prisma.book.findMany({
      where: {
        featured: true,
        isActive: true,
      },
      include: {
        category: true,
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  // Serialize Decimal to number for Client Component
  const featuredBooks = featuredBooksRaw.map((book) => ({
    ...book,
    price: book.price.toNumber(),
  }));

  return (
    <>
      <Header />
      
      {/* Early Buyer Promotion */}
      <section className="py-8">
        <div className="container-custom">
          <EarlyBuyerBanner />
        </div>
      </section>

      <HomePageClient categories={categories} featuredBooks={featuredBooks} />

      <Footer />
    </>
  );
}
