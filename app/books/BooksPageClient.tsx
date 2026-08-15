"use client";

import { useState } from "react";
import { Book, Category } from "@prisma/client";
import BookGrid from "@/components/books/BookGrid";
import { useLanguage } from "@/contexts/LanguageContext";

interface BooksPageClientProps {
  initialBooks: (Omit<Book, "price"> & { price: number; category: Category })[];
  categories: Category[];
}

export default function BooksPageClient({ initialBooks, categories }: BooksPageClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const { t } = useLanguage();

  const filteredBooks = selectedCategory
    ? initialBooks.filter((book) => book.categoryId === selectedCategory)
    : initialBooks;

  return (
    <div className="flex gap-8">
      {/* Left Sidebar - Category Filter */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <h2 className="font-serif text-xl font-semibold mb-4">
            {t("filterByCategory")}
          </h2>
          
          <div className="space-y-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-4 py-2 rounded-sm transition-colors ${
                selectedCategory === null
                  ? "bg-accent text-white"
                  : "bg-surface hover:bg-surface-light"
              }`}
            >
              {t("allCategories")}
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-2 rounded-sm transition-colors ${
                  selectedCategory === category.id
                    ? "bg-accent text-white"
                    : "bg-surface hover:bg-surface-light"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Category Filter */}
      <div className="lg:hidden mb-6 w-full">
        <label className="block text-sm font-medium mb-2">
          {t("filterByCategory")}
        </label>
        <select
          value={selectedCategory || ""}
          onChange={(e) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}
          className="input-field"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="mb-8">
          <p className="text-foreground-secondary">
            {t("showing")} {filteredBooks.length} {t("booksFound")}
          </p>
        </div>
        
        <BookGrid books={filteredBooks} />
      </div>
    </div>
  );
}
