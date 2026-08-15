"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCover from "@/components/books/BookCover";
import { formatVND } from "@/lib/currency";
import { Trash2, Plus, Minus } from "lucide-react";

interface CartItem {
  id: number;
  quantity: number;
  book: {
    id: number;
    title: string;
    slug: string;
    coverImage: string;
    price: number;
    authors: string;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const response = await fetch("/api/cart");
      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cartItems);
      } else if (response.status === 401) {
        router.push("/login?redirect=/cart");
      }
    } catch (error) {
      console.error("Load cart error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(itemId);
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems(cartItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      }
    } catch (error) {
      console.error("Update quantity error:", error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: number) => {
    if (!confirm("Xóa sách này khỏi giỏ hàng?")) return;

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCartItems(cartItems.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error("Remove item error:", error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);

  if (loading) {
    return (
      <>
        <Header />
        <main className="section-padding min-h-screen">
          <div className="container-custom">
            <p className="text-center text-foreground-secondary">Đang tải...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="section-padding min-h-screen">
        <div className="container-custom max-w-4xl">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-8">
            Giỏ hàng ({cartItems.length})
          </h1>

          {cartItems.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-foreground-secondary mb-6">
                Giỏ hàng của bạn đang trống
              </p>
              <Link href="/books" className="btn-primary inline-block">
                Khám phá sách
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="card">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-20">
                        <BookCover src={item.book.coverImage} alt={item.book.title} />
                      </div>
                      
                      <div className="flex-1">
                        <Link
                          href={`/books/${item.book.slug}`}
                          className="font-serif text-lg font-semibold hover:text-accent transition-colors"
                        >
                          {item.book.title}
                        </Link>
                        <p className="text-sm text-foreground-secondary mt-1">
                          {item.book.authors}
                        </p>
                        <p className="text-accent font-semibold mt-2">
                          {formatVND(item.book.price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-foreground-secondary hover:text-error transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity === 1}
                            className="p-1 text-foreground-secondary hover:text-foreground transition-colors disabled:opacity-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id}
                            className="p-1 text-foreground-secondary hover:text-foreground transition-colors disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="font-semibold">
                          {formatVND(item.book.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-medium">Tổng cộng:</span>
                  <span className="text-2xl font-bold text-accent">
                    {formatVND(total)}
                  </span>
                </div>

                <Link
                  href="/checkout/cart"
                  className="btn-primary w-full text-center block"
                >
                  Thanh toán
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
