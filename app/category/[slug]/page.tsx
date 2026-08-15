import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookGrid from "@/components/books/BookGrid";
import { prisma } from "@/lib/db";
import { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category || !category.isActive) {
    notFound();
  }

  const booksRaw = await prisma.book.findMany({
    where: {
      categoryId: category.id,
      isActive: true,
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  // Serialize Decimal to number
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
              {category.name}
            </h1>
            <p className="text-foreground-secondary text-lg max-w-3xl">
              {category.description}
            </p>
            <p className="text-foreground-secondary mt-4">
              {books.length} {books.length === 1 ? "book" : "books"} available
            </p>
          </div>
          
          <BookGrid books={books} />
        </div>
      </main>
      <Footer />
    </>
  );
}
