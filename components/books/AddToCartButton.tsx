"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";

interface AddToCartButtonProps {
  bookId: number;
  bookSlug: string;
}

export default function AddToCartButton({ bookId, bookSlug }: AddToCartButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, quantity: 1 }),
        credentials: "include", // Important for cookies!
      });

      if (response.status === 401) {
        // Not logged in, redirect to login
        router.push(`/login?redirect=/books/${bookSlug}`);
        return;
      }

      if (response.ok) {
        // Successfully added, go to cart
        router.push("/cart");
      } else {
        const data = await response.json();
        alert(data.error || "Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      alert("Lỗi khi thêm vào giỏ hàng. Vui lòng đăng nhập.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className="btn-secondary inline-flex items-center gap-2 text-lg"
    >
      <ShoppingCart className="w-5 h-5" />
      {loading ? "Đang thêm..." : "Thêm vào giỏ"}
    </button>
  );
}
