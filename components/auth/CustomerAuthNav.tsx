"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, ShoppingCart } from "lucide-react";

interface Customer {
  id: number;
  phone: string;
  fullName: string;
}

export default function CustomerAuthNav() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/customer/me");
      if (response.ok) {
        const data = await response.json();
        setCustomer(data.customer);
      }
    } catch (error) {
      // Not logged in
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (customer) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/cart"
          className="text-foreground-secondary hover:text-foreground transition-colors"
          title="Giỏ hàng"
        >
          <ShoppingCart className="w-5 h-5" />
        </Link>
        <Link
          href="/account"
          className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="hidden lg:inline text-sm">{customer.fullName}</span>
        </Link>
      </div>
    );
  }

  return (
    <Link href="/login" className="btn-secondary text-sm px-4 py-2">
      Đăng nhập
    </Link>
  );
}
