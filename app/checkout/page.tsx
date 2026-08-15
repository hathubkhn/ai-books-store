import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCover from "@/components/books/BookCover";
import CheckoutForm from "@/components/order/CheckoutForm";
import { prisma } from "@/lib/db";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your book order",
};

interface CheckoutPageProps {
  searchParams: Promise<{ book?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = await searchParams;
  const bookSlug = params.book;

  if (!bookSlug) {
    notFound();
  }

  const bookRaw = await prisma.book.findUnique({
    where: { slug: bookSlug },
    include: { category: true },
  });

  if (!bookRaw || !bookRaw.isActive) {
    notFound();
  }

  // Serialize Decimal to number for Client Component
  const book = {
    ...bookRaw,
    price: bookRaw.price.toNumber(),
  };

  return (
    <>
      <Header />
      <main className="section-padding min-h-screen">
        <div className="container-custom max-w-6xl">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-8">
            Checkout
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Book Info */}
            <div>
              <div className="card sticky top-24">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-24">
                    <BookCover src={book.coverImage} alt={book.title} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-xl font-semibold mb-2">
                      {book.title}
                    </h2>
                    <p className="text-sm text-foreground-secondary mb-1">
                      {book.authors}
                    </p>
                    <p className="text-sm text-foreground-secondary">
                      {book.publisher}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div>
              <CheckoutForm book={book} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
