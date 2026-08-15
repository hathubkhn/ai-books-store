"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Book } from "@prisma/client";
import { formatVND } from "@/lib/currency";

interface CheckoutFormProps {
  book: Omit<Book, "price"> & { price: number };
}

export default function CheckoutForm({ book }: CheckoutFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [promotion, setPromotion] = useState<any>(null);
  const [checkingPromo, setCheckingPromo] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    shippingAddress: "",
    alternativeAddress: "",
    province: "",
    note: "",
    quantity: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load customer data on mount
  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = async () => {
    try {
      const response = await fetch("/api/customer/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          fullName: data.customer.fullName || "",
          phone: data.customer.phone || "",
          shippingAddress: data.customer.defaultAddress || "",
          province: data.customer.province || "",
        }));
      }
    } catch (error) {
      // Silently fail - user can still fill form manually
      console.error("Error loading customer data:", error);
    }
  };

  // Check promotion when phone changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (formData.phone.length >= 10) {
        checkPromotion(formData.phone);
      } else {
        setPromotion(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formData.phone]);

  const checkPromotion = async (phone: string) => {
    setCheckingPromo(true);
    try {
      const response = await fetch(
        `/api/promotion?phone=${encodeURIComponent(phone)}&bookSlug=${encodeURIComponent(book.slug)}`
      );
      const data = await response.json();
      setPromotion(data);
    } catch (error) {
      console.error("Error checking promotion:", error);
    } finally {
      setCheckingPromo(false);
    }
  };

  const unitPrice = Number(book.price);
  const subtotal = unitPrice * formData.quantity;
  const discountPercent = promotion?.discountPercent || 0;
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          bookSlug: book.slug,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.error || "Failed to create order");
        }
        setLoading(false);
        return;
      }

      // Redirect to payment confirmation page
      router.push(`/order-confirmation/${data.orderCode}`);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-semibold mb-6">
          Recipient Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name <span className="text-error">*</span>
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="input-field"
              required
            />
            {errors.fullName && (
              <p className="text-error text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Phone Number <span className="text-error">*</span>
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
              required
            />
            {errors.phone && (
              <p className="text-error text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Promotion Notice */}
          {checkingPromo && (
            <div className="p-4 bg-surface rounded-sm text-sm text-foreground-secondary">
              Checking eligibility...
            </div>
          )}
          
          {promotion && promotion.discountPercent > 0 && (
            <div className="p-4 bg-accent-soft border border-accent/20 rounded-sm">
              <p className="font-medium text-foreground mb-1">
                🎉 {promotion.isEarlyBuyer ? "You qualify for 10% off this order!" : "Welcome back!"}
              </p>
              <p className="text-sm text-foreground-secondary">
                {promotion.isEarlyBuyer
                  ? "As one of our first 50 customers, you receive an exclusive discount."
                  : "Returning customer offer: -10%"}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              Shipping Address <span className="text-error">*</span>
            </label>
            <textarea
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              className="textarea-field"
              rows={3}
              required
            />
            {errors.shippingAddress && (
              <p className="text-error text-sm mt-1">{errors.shippingAddress}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Alternative Address (Optional)
            </label>
            <textarea
              value={formData.alternativeAddress}
              onChange={(e) => setFormData({ ...formData, alternativeAddress: e.target.value })}
              className="textarea-field"
              rows={2}
              placeholder="Alternative delivery address (if any)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Province / City
            </label>
            <input
              type="text"
              value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Note
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="textarea-field"
              rows={2}
              maxLength={500}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              className="input-field"
              min="1"
              max="20"
              required
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="border-t border-border pt-6">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-sm">
            <span>Book price</span>
            <span>{formatVND(subtotal)}</span>
          </div>
          
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>{discountPercent}% discount</span>
              <span>-{formatVND(discountAmount)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-semibold text-lg pt-3 border-t border-border">
            <span>Total</span>
            <span className="text-accent">{formatVND(total)}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </form>
  );
}
