import Link from "next/link";
import BookCover from "./BookCover";
import BookPrice from "./BookPrice";
import { Book, Category } from "@prisma/client";

interface BookCardProps {
  book: Omit<Book, "price"> & { price: number; category: Category };
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.slug}`} className="group block">
      <div className="mb-4 book-cover-hover">
        <BookCover src={book.coverImage} alt={book.title} />
      </div>
      
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-wider text-foreground-secondary">
          {book.category.name}
        </div>
        
        <h3 className="font-serif text-lg md:text-xl font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {book.title}
        </h3>
        
        <div className="text-sm text-foreground-secondary">
          {book.authors}
        </div>
        
        <div className="text-sm text-foreground-secondary">
          {book.publisher}
        </div>
        
        <BookPrice price={book.price} className="text-lg" />
        
        <div className="pt-2">
          <span className="text-sm text-accent group-hover:underline">
            View Book →
          </span>
        </div>
      </div>
    </Link>
  );
}
