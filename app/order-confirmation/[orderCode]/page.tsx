"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CheckCircle2, Copy, Upload, Loader2 } from "lucide-react";

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderCode = params.orderCode as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Bank transfer info
  const bankInfo = {
    bankName: "Ngân hàng TMCP Á Châu (ACB)",
    accountNumber: "1234567890",
    accountName: "CÔNG TY AI BOOKS",
    amount: order?.finalAmount || 0,
    content: orderCode,
  };

  useEffect(() => {
    fetchOrder();
  }, [orderCode]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderCode}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Không tìm thấy đơn hàng");
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
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

  if (error || !order) {
    return (
      <>
        <Header />
        <main className="section-padding">
          <div className="container-custom text-center">
            <h1 className="font-serif text-3xl font-semibold mb-4">
              Không tìm thấy đơn hàng
            </h1>
            <p className="text-foreground-secondary mb-6">{error}</p>
            <a href="/" className="btn-primary">
              Về trang chủ
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="section-padding">
        <div className="container-custom max-w-4xl">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="font-serif text-4xl font-semibold mb-4">
              Đặt hàng thành công!
            </h1>
            <p className="text-xl text-foreground-secondary mb-2">
              Mã đơn hàng: <strong className="text-accent">{orderCode}</strong>
            </p>
            <p className="text-foreground-secondary">
              Cảm ơn bạn đã đặt hàng tại AI Books Store
            </p>
          </div>

          {/* Payment Instructions */}
          <div className="card bg-accent-soft border-accent/20 mb-8">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              📱 Bước tiếp theo: Chuyển khoản
            </h2>
            <p className="text-foreground-secondary mb-6">
              Vui lòng chuyển khoản theo thông tin bên dưới. Đơn hàng sẽ được xác
              nhận sau khi chúng tôi nhận được thanh toán (thường trong vòng 1-2 giờ).
            </p>

            <div className="bg-white rounded-sm p-6 space-y-4">
              {/* Bank Name */}
              <div>
                <label className="text-sm text-foreground-secondary block mb-1">
                  Ngân hàng
                </label>
                <div className="flex items-center gap-2">
                  <strong className="text-lg">{bankInfo.bankName}</strong>
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="text-sm text-foreground-secondary block mb-1">
                  Số tài khoản
                </label>
                <div className="flex items-center gap-2">
                  <strong className="text-2xl font-mono">
                    {bankInfo.accountNumber}
                  </strong>
                  <button
                    onClick={() => copyToClipboard(bankInfo.accountNumber)}
                    className="btn-secondary !py-1 !px-2 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Account Name */}
              <div>
                <label className="text-sm text-foreground-secondary block mb-1">
                  Tên tài khoản
                </label>
                <strong className="text-lg">{bankInfo.accountName}</strong>
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm text-foreground-secondary block mb-1">
                  Số tiền
                </label>
                <div className="flex items-center gap-2">
                  <strong className="text-3xl text-accent">
                    {order.finalAmount.toLocaleString("vi-VN")}₫
                  </strong>
                  <button
                    onClick={() =>
                      copyToClipboard(order.finalAmount.toString())
                    }
                    className="btn-secondary !py-1 !px-2 text-sm"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Transfer Content */}
              <div>
                <label className="text-sm text-foreground-secondary block mb-1">
                  Nội dung chuyển khoản
                </label>
                <div className="flex items-center gap-2">
                  <strong className="text-xl font-mono text-accent">
                    {orderCode}
                  </strong>
                  <button
                    onClick={() => copyToClipboard(orderCode)}
                    className="btn-secondary !py-1 !px-2 text-sm"
                  >
                    {copySuccess ? "Đã copy!" : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-foreground-secondary mt-1">
                  ⚠️ Quan trọng: Vui lòng ghi chính xác mã đơn hàng để chúng tôi
                  xác nhận nhanh hơn
                </p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="card mb-8">
            <h3 className="font-serif text-xl font-semibold mb-4">
              Chi tiết đơn hàng
            </h3>

            <div className="space-y-3 mb-6">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.bookTitle} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>{order.subtotal.toLocaleString("vi-VN")}₫</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Giảm giá ({order.discountPercent}%):</span>
                  <span>-{order.discountAmount.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-accent">
                  {order.total.toLocaleString("vi-VN")}₫
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="card mb-8">
            <h3 className="font-serif text-xl font-semibold mb-4">
              Thông tin nhận hàng
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Người nhận:</strong> {order.recipientName}
              </p>
              <p>
                <strong>Số điện thoại:</strong> {order.phone}
              </p>
              <p>
                <strong>Địa chỉ:</strong> {order.shippingAddress}
              </p>
              {order.alternativeAddress && (
                <p>
                  <strong>Địa chỉ thay thế:</strong> {order.alternativeAddress}
                </p>
              )}
              {order.province && (
                <p>
                  <strong>Tỉnh/Thành phố:</strong> {order.province}
                </p>
              )}
              {order.note && (
                <p>
                  <strong>Ghi chú:</strong> {order.note}
                </p>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div className="card bg-surface-light">
            <h3 className="font-serif text-xl font-semibold mb-4">
              Điều gì sẽ xảy ra tiếp theo?
            </h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium">
                  1
                </span>
                <span>
                  Bạn chuyển khoản theo thông tin bên trên
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium">
                  2
                </span>
                <span>
                  Chúng tôi xác nhận thanh toán (1-2 giờ trong giờ hành chính)
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium">
                  3
                </span>
                <span>Đóng gói và gửi hàng (2-3 ngày làm việc)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-medium">
                  4
                </span>
                <span>Bạn nhận hàng (3-5 ngày tùy khu vực)</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <a href="/account" className="btn-primary">
              Xem đơn hàng của tôi
            </a>
            <a href="/books" className="btn-secondary">
              Tiếp tục mua sắm
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
