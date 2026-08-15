"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCard from "@/components/books/BookCard";
import { Loader2, Check, ShoppingCart } from "lucide-react";

export default function BundleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bundleSlug = params.slug as string;

  const [bundle, setBundle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Selected books (for customization)
  const [selectedBookIds, setSelectedBookIds] = useState<number[]>([]);
  const [calculation, setCalculation] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchBundle();
  }, [bundleSlug]);

  useEffect(() => {
    if (bundle && selectedBookIds.length > 0) {
      calculatePrice();
    }
  }, [selectedBookIds]);

  const fetchBundle = async () => {
    try {
      const res = await fetch(`/api/bundles/${bundleSlug}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không tìm thấy combo");
      }

      setBundle(data.bundle);
      // Initially select all books
      setSelectedBookIds(data.bundle.items.map((item: any) => item.bookId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePrice = async () => {
    setIsCalculating(true);
    try {
      const res = await fetch("/api/bundles/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleSlug,
          selectedBookIds,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi tính giá");
      }

      setCalculation(data.calculation);
    } catch (err: any) {
      console.error("Calculate error:", err);
    } finally {
      setIsCalculating(false);
    }
  };

  const toggleBook = (bookId: number) => {
    if (selectedBookIds.includes(bookId)) {
      setSelectedBookIds(selectedBookIds.filter((id) => id !== bookId));
    } else {
      setSelectedBookIds([...selectedBookIds, bookId]);
    }
  };

  const handleAddToCart = async () => {
    if (selectedBookIds.length === 0) {
      alert("Vui lòng chọn ít nhất một cuốn sách");
      return;
    }

    setIsAdding(true);

    try {
      const res = await fetch("/api/bundles/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bundleSlug,
          selectedBookIds,
        }),
        credentials: "include",
      });

      if (res.status === 401) {
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Lỗi thêm vào giỏ");
      }

      alert(data.message || "Đã thêm combo vào giỏ hàng!");
      router.push("/cart");
    } catch (err: any) {
      alert(err.message);
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="section-padding min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </main>
        <Footer />
      </>
    );
  }

  if (error || !bundle) {
    return (
      <>
        <Header />
        <main className="section-padding">
          <div className="container-custom text-center">
            <h1 className="font-serif text-3xl font-semibold mb-4">
              Không tìm thấy combo
            </h1>
            <p className="text-foreground-secondary mb-6">{error}</p>
            <a href="/roadmap" className="btn-primary">
              Về lộ trình học
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const originalTotal = bundle.items.reduce(
    (sum: number, item: any) => sum + item.book.price,
    0
  );

  return (
    <>
      <Header />
      <main className="section-padding">
        <div className="container-custom max-w-6xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <a
              href="/roadmap"
              className="text-accent text-sm hover:underline"
            >
              ← Quay lại lộ trình học
            </a>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-semibold mb-4">
              {bundle.title}
            </h1>
            <p className="text-xl text-foreground-secondary mb-4">
              {bundle.description}
            </p>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-accent-soft text-accent rounded-sm font-medium">
                {bundle.level}
              </span>
              <span className="text-foreground-secondary">
                {bundle.items.length} cuốn sách
              </span>
              {bundle.track && (
                <span className="text-foreground-secondary">
                  Lộ trình: {bundle.track.name}
                </span>
              )}
            </div>
          </div>

          {/* Price Summary */}
          <div className="card bg-accent-soft border-accent/20 mb-8">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Giá combo
            </h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Giá gốc ({bundle.items.length} cuốn):</span>
                <span className="line-through text-foreground-secondary">
                  {originalTotal.toLocaleString("vi-VN")}₫
                </span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Giảm giá combo ({bundle.discountValue}%):</span>
                <span>
                  -{((originalTotal * bundle.discountValue) / 100).toLocaleString("vi-VN")}₫
                </span>
              </div>
              {calculation && calculation.volumeDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    Giảm thêm ({calculation.itemCount} cuốn: +{calculation.volumeDiscount}%):
                  </span>
                  <span>
                    -{calculation.volumeDiscountAmount.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              )}
              <div className="flex justify-between text-2xl font-bold text-accent pt-2 border-t">
                <span>Tổng cộng:</span>
                <span>
                  {calculation
                    ? calculation.finalTotal.toLocaleString("vi-VN")
                    : (
                        originalTotal -
                        (originalTotal * bundle.discountValue) / 100
                      ).toLocaleString("vi-VN")}
                  ₫
                </span>
              </div>
              <div className="text-sm text-green-600">
                Tiết kiệm:{" "}
                {calculation
                  ? calculation.savingsAmount.toLocaleString("vi-VN")
                  : ((originalTotal * bundle.discountValue) / 100).toLocaleString("vi-VN")}
                ₫ (
                {calculation
                  ? Math.round(calculation.savingsPercent)
                  : bundle.discountValue}
                %)
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isAdding || selectedBookIds.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang thêm...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  Thêm cả combo vào giỏ ({selectedBookIds.length} cuốn)
                </>
              )}
            </button>
          </div>

          {/* Book List */}
          <div className="mb-8">
            <h2 className="font-serif text-2xl font-semibold mb-6">
              Sách trong combo
            </h2>
            <div className="space-y-4">
              {bundle.items.map((item: any) => {
                const isSelected = selectedBookIds.includes(item.bookId);

                return (
                  <div
                    key={item.id}
                    className={`card transition-all ${
                      isSelected
                        ? "border-accent shadow-md"
                        : "opacity-60 border-surface"
                    }`}
                  >
                    <div className="flex gap-6">
                      {/* Checkbox */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => toggleBook(item.bookId)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "bg-accent border-accent text-white"
                              : "border-border hover:border-accent"
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Book Info */}
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                          <h3 className="font-serif text-lg font-semibold mb-2">
                            {item.book.title}
                          </h3>
                          <p className="text-sm text-foreground-secondary mb-2">
                            {item.book.authors}
                          </p>
                          {item.isRequired && (
                            <span className="inline-block px-2 py-1 bg-accent-soft text-accent text-xs font-medium rounded-sm">
                              Bắt buộc
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">
                            {item.book.price.toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="card bg-surface-light text-center">
            <p className="text-foreground-secondary mb-4">
              💡 Mẹo: Bỏ chọn những cuốn bạn đã có để giảm giá combo
            </p>
            <p className="text-sm text-foreground-secondary">
              Lưu ý: Giảm giá theo số lượng sách (2 cuốn: +5%, 3 cuốn: +8%, 4+ cuốn: +10%)
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
