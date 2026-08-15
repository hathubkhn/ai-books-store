"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatVND } from "@/lib/currency";
import { Package, User, LogOut } from "lucide-react";

interface Customer {
  id: number;
  phone: string;
  fullName: string;
  defaultAddress?: string;
  province?: string;
}

interface Order {
  id: number;
  orderCode: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: number;
    bookTitle: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export default function AccountPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  useEffect(() => {
    loadAccount();
  }, []);

  const loadAccount = async () => {
    try {
      const [customerRes, ordersRes] = await Promise.all([
        fetch("/api/customer/me"),
        fetch("/api/customer/orders"),
      ]);

      if (customerRes.status === 401 || ordersRes.status === 401) {
        router.push("/login?redirect=/account");
        return;
      }

      if (customerRes.ok) {
        const data = await customerRes.json();
        setCustomer(data.customer);
      }

      if (ordersRes.ok) {
        const data = await ordersRes.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Load account error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/customer/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      PACKING: "Đang đóng gói",
      SHIPPING: "Đang giao",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: "bg-warning/10 text-warning",
      CONFIRMED: "bg-success/10 text-success",
      PACKING: "bg-accent/10 text-accent",
      SHIPPING: "bg-accent/10 text-accent",
      COMPLETED: "bg-success/10 text-success",
      CANCELLED: "bg-error/10 text-error",
    };
    return colorMap[status] || "bg-foreground/10 text-foreground";
  };

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

  if (!customer) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="section-padding min-h-screen">
        <div className="container-custom max-w-6xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
                Tài khoản của tôi
              </h1>
              <p className="text-foreground-secondary">
                {customer.fullName} • {customer.phone}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Đăng xuất
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 border-b border-border mb-8">
            <button
              onClick={() => setActiveTab("orders")}
              className={`pb-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === "orders"
                  ? "border-accent text-accent"
                  : "border-transparent text-foreground-secondary hover:text-foreground"
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Đơn hàng ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`pb-3 px-4 font-medium transition-colors border-b-2 ${
                activeTab === "profile"
                  ? "border-accent text-accent"
                  : "border-transparent text-foreground-secondary hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4 inline mr-2" />
              Thông tin cá nhân
            </button>
          </div>

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              {orders.length === 0 ? (
                <div className="card text-center py-12">
                  <p className="text-foreground-secondary mb-6">
                    Bạn chưa có đơn hàng nào
                  </p>
                  <Link href="/books" className="btn-primary inline-block">
                    Khám phá sách
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="card">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-semibold">#{order.orderCode}</p>
                          <p className="text-sm text-foreground-secondary">
                            {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-sm text-sm font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span className="text-foreground-secondary">
                              {item.bookTitle} x{item.quantity}
                            </span>
                            <span className="font-medium">
                              {formatVND(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-border">
                        <span className="font-medium">Tổng cộng:</span>
                        <span className="text-xl font-bold text-accent">
                          {formatVND(order.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="card max-w-2xl">
              <h2 className="font-serif text-2xl font-semibold mb-6">
                Thông tin cá nhân
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ và tên</label>
                  <p className="text-foreground-secondary">{customer.fullName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                  <p className="text-foreground-secondary">{customer.phone}</p>
                </div>

                {customer.defaultAddress && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Địa chỉ mặc định</label>
                    <p className="text-foreground-secondary">{customer.defaultAddress}</p>
                  </div>
                )}

                {customer.province && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Tỉnh/Thành phố</label>
                    <p className="text-foreground-secondary">{customer.province}</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <Link href="/cart" className="btn-primary inline-block">
                  Xem giỏ hàng
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
