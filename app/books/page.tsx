import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/db";
import { Metadata } from "next";
import BooksPageClient from "./BooksPageClient";

export const metadata: Metadata = {
  title: "All Books",
  description: "Browse our complete collection of AI, Machine Learning, and Computer Science books.",
};

export default async function BooksPage() {
  const [booksRaw, categories] = await Promise.all([
    prisma.book.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  // Serialize Decimal to number for Client Component
  const books = booksRaw.map((book) => ({
    ...book,
    price: book.price.toNumber(),
  }));

  return (
    <>
      <Header />
      <main className="section-padding">
        <div className="container-custom">
          <div className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              All Books
            </h1>
          </div>
          
          <BooksPageClient initialBooks={books} categories={categories} />
        </div>
      </main>
      <Footer />
    </>
  );
}
