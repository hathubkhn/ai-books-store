"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookCover from "@/components/books/BookCover";
import { formatVND } from "@/lib/currency";
import { Loader2 } from "lucide-react";

interface CartItem {
  id: number;
  quantity: number;
  book: {
    id: number;
    title: string;
    slug: string;
    coverImage: string;
    price: number;
  };
}

export default function CartCheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    recipientName: "",
    phone: "",
    shippingAddress: "",
    alternativeAddress: "",
    province: "",
    note: "",
  });

  useEffect(() => {
    loadCartAndCustomer();
  }, []);

  const loadCartAndCustomer = async () => {
    try {
      // Load cart and customer info in parallel
      const [cartResponse, customerResponse] = await Promise.all([
        fetch("/api/cart", { credentials: "include" }),
        fetch("/api/customer/me", { credentials: "include" }),
      ]);

      if (cartResponse.status === 401) {
        router.push("/login?redirect=/checkout/cart");
        return;
      }

      if (cartResponse.ok) {
        const cartData = await cartResponse.json();
        setCartItems(cartData.cartItems);

        if (cartData.cartItems.length === 0) {
          router.push("/cart");
        }
      } else {
        throw new Error("Không thể tải giỏ hàng");
      }

      // Prefill form with customer data
      if (customerResponse.ok) {
        const customerData = await customerResponse.json();
        setFormData((prev) => ({
          ...prev,
          recipientName: customerData.customer.fullName || "",
          phone: customerData.customer.phone || "",
          shippingAddress: customerData.customer.defaultAddress || "",
          province: customerData.customer.province || "",
        }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Create order with cart items
      const response = await fetch("/api/checkout/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Đặt hàng thất bại");
      }

      // Redirect to payment confirmation
      router.push(`/order-confirmation/${data.orderCode}`);
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
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

  if (error && cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="section-padding">
          <div className="container-custom text-center">
            <h1 className="font-serif text-3xl font-semibold mb-4">Lỗi</h1>
            <p className="text-foreground-secondary mb-6">{error}</p>
            <a href="/cart" className="btn-primary">
              Quay lại giỏ hàng
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  );

  return (
    <>
      <Header />
      <main className="section-padding">
        <div className="container-custom max-w-6xl">
          <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-8">
            Thanh toán
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <h2 className="font-serif text-2xl font-semibold mb-6">
                Đơn hàng của bạn
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-28 flex-shrink-0">
                      <BookCover
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-2">{item.book.title}</h3>
                      <p className="text-sm text-foreground-secondary mb-2">
                        Số lượng: {item.quantity}
                      </p>
                      <p className="font-semibold text-accent">
                        {formatVND(item.book.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-semibold mb-2">
                  <span>Tạm tính:</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-accent">
                  <span>Tổng cộng:</span>
                  <span>{formatVND(subtotal)}</span>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="order-1 lg:order-2">
              <h2 className="font-serif text-2xl font-semibold mb-6">
                Thông tin nhận hàng
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Họ tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({ ...formData, recipientName: e.target.value })
                    }
                    className="input-field"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="input-field"
                    placeholder="0901234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Địa chỉ nhận hàng <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: e.target.value,
                      })
                    }
                    className="input-field"
                    rows={3}
                    placeholder="Số nhà, tên đường, phường/xã"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Địa chỉ thay thế (tùy chọn)
                  </label>
                  <textarea
                    value={formData.alternativeAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        alternativeAddress: e.target.value,
                      })
                    }
                    className="input-field"
                    rows={2}
                    placeholder="Địa chỉ khác để nhận hàng (nếu có)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Tỉnh/Thành phố
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    className="input-field"
                    placeholder="Hà Nội"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                    className="input-field"
                    rows={2}
                    placeholder="Ghi chú cho người bán..."
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-sm text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Đặt hàng"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
