"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookGrid from "@/components/books/BookGrid";
import { Search } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
        setSearched(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setSearched(true);
    
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      setResults(data.books || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="section-padding min-h-screen">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-8">
              Search Books
            </h1>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-secondary" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search books, topics, authors..."
                className="input-field pl-12 text-lg"
                autoFocus
              />
            </div>
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-foreground-secondary">Searching...</p>
            </div>
          )}

          {!loading && searched && (
            <>
              <div className="mb-8">
                <p className="text-foreground-secondary">
                  {results.length} {results.length === 1 ? "result" : "results"} for "{query}"
                </p>
              </div>
              
              {results.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-foreground-secondary mb-4">
                    No matching books found.
                  </p>
                  <p className="text-foreground-secondary text-sm">
                    Try searching for different keywords or browse our categories.
                  </p>
                </div>
              ) : (
                <BookGrid books={results} />
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <>
        <Header />
        <main className="section-padding min-h-screen">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-8">
                Search Books
              </h1>
              <div className="text-center py-12">
                <p className="text-foreground-secondary">Loading...</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    }>
      <SearchContent />
    </Suspense>
  );
}
