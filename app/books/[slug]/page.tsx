import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCover from "@/components/books/BookCover";
import BookPrice from "@/components/books/BookPrice";
import BookGrid from "@/components/books/BookGrid";
import AddToCartButton from "@/components/books/AddToCartButton";
import { prisma } from "@/lib/db";
import { Metadata } from "next";

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = await prisma.book.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!book) {
    return {
      title: "Book Not Found",
    };
  }

  return {
    title: book.title,
    description: book.shortDescription,
  };
}

export default async function BookDetailPage({ params }: BookPageProps) {
  const { slug } = await params;
  
  const book = await prisma.book.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!book || !book.isActive) {
    notFound();
  }

  // Get related books from same category
  const relatedBooksRaw = await prisma.book.findMany({
    where: {
      categoryId: book.categoryId,
      isActive: true,
      NOT: { id: book.id },
    },
    include: { category: true },
    take: 4,
  });

  // Serialize Decimal to number
  const relatedBooks = relatedBooksRaw.map((b) => ({
    ...b,
    price: b.price.toNumber(),
  }));

  // Get unique customer count who ordered this book
  const uniqueOrders = await prisma.order.findMany({
    where: {
      items: {
        some: {
          bookId: book.id,
        },
      },
    },
    select: {
      customerId: true,
    },
    distinct: ['customerId'],
  });
  const orderCount = uniqueOrders.length;

  // Get roadmap information for this book
  const roadmapMappings = await prisma.bookStageMapping.findMany({
    where: {
      bookId: book.id,
    },
    include: {
      stage: {
        include: {
          track: true,
        },
      },
    },
    orderBy: {
      recommendationPriority: 'desc',
    },
    take: 3, // Top 3 roadmaps
  });

  // Get books often learned together (same stage, different books)
  const relatedInRoadmap = roadmapMappings.length > 0
    ? await prisma.bookStageMapping.findMany({
        where: {
          stageId: roadmapMappings[0].stageId,
          bookId: { not: book.id },
          book: { isActive: true },
        },
        include: {
          book: {
            include: {
              category: true,
            },
          },
        },
        take: 4,
      })
    : [];

  const booksLearnedTogether = relatedInRoadmap.map((mapping) => ({
    ...mapping.book,
    price: mapping.book.price.toNumber(),
  }));

  return (
    <>
      <Header />
      <main>
        {/* Book Detail Section */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Book Cover */}
              <div>
                <BookCover
                  src={book.coverImage}
                  alt={book.title}
                  className="max-w-md mx-auto lg:mx-0"
                />
              </div>

              {/* Book Info */}
              <div>
                <Link
                  href={`/category/${book.category.slug}`}
                  className="text-sm uppercase tracking-wider text-accent hover:underline mb-4 inline-block"
                >
                  {book.category.name}
                </Link>

                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                  {book.title}
                </h1>

                <div className="space-y-2 mb-6 text-foreground-secondary">
                  <p>
                    <span className="font-medium">Authors:</span> {book.authors}
                  </p>
                  <p>
                    <span className="font-medium">Publisher:</span> {book.publisher}
                  </p>
                  {book.publishedYear && (
                    <p>
                      <span className="font-medium">Year:</span> {book.publishedYear}
                    </p>
                  )}
                  {book.audience && (
                    <p>
                      <span className="font-medium">Target Audience:</span> {book.audience}
                    </p>
                  )}
                  {book.isbn && (
                    <p>
                      <span className="font-medium">ISBN:</span> {book.isbn}
                    </p>
                  )}
                </div>

                <p className="text-lg text-foreground-secondary mb-8">
                  {book.shortDescription}
                </p>

                {book.translationSource && (
                  <div className="mb-6 p-4 bg-accent-soft border border-accent/20 rounded-sm">
                    <p className="text-sm font-medium text-foreground">
                      📚 Được dịch từ: <span className="text-accent">{book.translationSource}</span>
                    </p>
                  </div>
                )}

                <div className="mb-8">
                  <BookPrice price={Number(book.price)} className="text-3xl" />
                  <p className="text-sm text-foreground-secondary mt-2">
                    <span className="font-medium text-accent">{orderCount}</span> người đã mua sách này
                  </p>
                </div>

                <div className="flex gap-4">
                  <AddToCartButton bookId={book.id} bookSlug={book.slug} />
                  <Link
                    href={`/checkout?book=${book.slug}`}
                    className="btn-primary inline-block text-lg"
                  >
                    Mua ngay
                  </Link>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="mt-16 max-w-4xl">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6">
                About This Book
              </h2>
              <div className="prose prose-lg max-w-none text-foreground-secondary whitespace-pre-line">
                {book.fullDescription}
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap Integration */}
        {roadmapMappings.length > 0 && (
          <section className="section-padding bg-gradient-to-br from-accent-soft to-surface-light">
            <div className="container-custom max-w-5xl">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 text-center">
                📚 Cuốn sách này nằm trong lộ trình nào?
              </h2>
              <p className="text-center text-foreground-secondary mb-8">
                Khám phá lộ trình học phù hợp với bạn
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roadmapMappings.map((mapping) => (
                  <a
                    key={mapping.id}
                    href={`/roadmap/${mapping.stage.track.slug}`}
                    className="card hover:shadow-lg transition-shadow text-center"
                  >
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-accent-soft text-accent rounded-full text-sm font-medium">
                        {mapping.stage.level}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold mb-2">
                      {mapping.stage.track.name}
                    </h3>
                    <p className="text-sm text-foreground-secondary mb-4">
                      Giai đoạn: {mapping.stage.title}
                    </p>
                    <div className="btn-primary text-sm inline-block">
                      Xem toàn bộ lộ trình →
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Books Learned Together */}
        {booksLearnedTogether.length > 0 && (
          <section className="section-padding">
            <div className="container-custom">
              <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
                🎯 Thường được học cùng
              </h2>
              <p className="text-foreground-secondary mb-8">
                Những cuốn sách khác trong cùng giai đoạn học tập
              </p>
              <BookGrid books={booksLearnedTogether.slice(0, 4)} />
            </div>
          </section>
        )}

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <section className="section-padding bg-surface">
            <div className="container-custom">
              <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-8">
                Sách liên quan
              </h2>
              <BookGrid books={relatedBooks} />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
