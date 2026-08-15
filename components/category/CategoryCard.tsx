import Link from "next/link";
import { Category } from "@prisma/client";

interface CategoryCardProps {
  category: Category & { _count?: { books: number } };
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  return (
    <Link href={`/category/${category.slug}`} className="group block">
      <div className="border border-border p-6 md:p-8 rounded-sm hover:border-accent transition-all duration-300">
        <div className="editorial-number">
          {String(index + 1).padStart(2, "0")}
        </div>
        
        <h3 className="font-serif text-xl md:text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
          {category.name}
        </h3>
        
        <p className="text-foreground-secondary mb-4 line-clamp-3">
          {category.description}
        </p>
        
        <span className="text-accent group-hover:underline inline-flex items-center gap-1">
          View Books
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
      </div>
    </Link>
  );
}
