"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Clock, ChevronDown, ChevronUp } from "lucide-react";

interface Order {
  id: number;
  orderCode: string;
  recipientName: string;
  phone: string;
  shippingAddress: string;
  province: string | null;
  note: string | null;
  subtotal: number;
  discountAmount: number;
  total: number;
  createdAt: Date;
  customer: {
    fullName: string;
    phone: string;
  };
  items: Array<{
    id: number;
    bookTitle: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
}

interface PaymentConfirmationListProps {
  orders: Order[];
}

export default function PaymentConfirmationList({
  orders,
}: PaymentConfirmationListProps) {
  const router = useRouter();
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());
  const [processingOrders, setProcessingOrders] = useState<Set<number>>(
    new Set()
  );

  const toggleExpand = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const handleConfirm = async (orderCode: string, orderId: number) => {
    if (
      !confirm(
        `Xác nhận đã nhận thanh toán cho đơn hàng ${orderCode}?\n\nHành động này không thể hoàn tác.`
      )
    ) {
      return;
    }

    setProcessingOrders(new Set(processingOrders).add(orderId));

    try {
      const res = await fetch("/api/admin/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lỗi xác nhận thanh toán");
      }

      alert(`Đã xác nhận thanh toán cho đơn hàng ${orderCode}`);
      router.refresh();
    } catch (error: any) {
      alert(error.message);
      const newProcessing = new Set(processingOrders);
      newProcessing.delete(orderId);
      setProcessingOrders(newProcessing);
    }
  };

  const handleReject = async (orderCode: string, orderId: number) => {
    const reason = prompt(
      `Lý do từ chối đơn hàng ${orderCode}:\n\n(Sẽ được gửi cho khách hàng)`
    );

    if (!reason || reason.trim() === "") {
      return;
    }

    setProcessingOrders(new Set(processingOrders).add(orderId));

    try {
      const res = await fetch("/api/admin/reject-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderCode, reason }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Lỗi từ chối đơn hàng");
      }

      alert(`Đã từ chối đơn hàng ${orderCode}`);
      router.refresh();
    } catch (error: any) {
      alert(error.message);
      const newProcessing = new Set(processingOrders);
      newProcessing.delete(orderId);
      setProcessingOrders(newProcessing);
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 24) {
      return `${Math.floor(hours / 24)} ngày trước`;
    } else if (hours > 0) {
      return `${hours} giờ trước`;
    } else {
      return `${minutes} phút trước`;
    }
  };

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isExpanded = expandedOrders.has(order.id);
        const isProcessing = processingOrders.has(order.id);
        const timeAgo = getTimeAgo(order.createdAt);

        return (
          <div key={order.id} className="card">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-serif text-xl font-semibold">
                    {order.orderCode}
                  </h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {timeAgo}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-foreground-secondary">
                  <p>
                    <strong>Khách hàng:</strong> {order.customer.fullName}
                  </p>
                  <p>
                    <strong>SĐT:</strong> {order.customer.phone}
                  </p>
                  <p>
                    <strong>Địa chỉ:</strong> {order.shippingAddress}
                    {order.province && `, ${order.province}`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-accent mb-2">
                  {order.total.toLocaleString("vi-VN")}₫
                </p>
                {order.discountAmount > 0 && (
                  <p className="text-xs text-green-600">
                    Giảm: {order.discountAmount.toLocaleString("vi-VN")}₫
                  </p>
                )}
              </div>
            </div>

            {/* Toggle Details */}
            <button
              onClick={() => toggleExpand(order.id)}
              className="text-sm text-accent hover:underline mb-4 flex items-center gap-1"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Ẩn chi tiết
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Xem chi tiết
                </>
              )}
            </button>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="mb-4 p-4 bg-surface rounded-sm space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Sản phẩm:</p>
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm py-1"
                    >
                      <span>
                        {item.bookTitle} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {item.lineTotal.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span>Tạm tính:</span>
                    <span>{order.subtotal.toLocaleString("vi-VN")}₫</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Giảm giá:</span>
                      <span>
                        -{order.discountAmount.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold mt-2">
                    <span>Tổng cộng:</span>
                    <span>{order.total.toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
                {order.note && (
                  <div>
                    <p className="text-sm font-medium">Ghi chú:</p>
                    <p className="text-sm text-foreground-secondary">
                      {order.note}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => handleConfirm(order.orderCode, order.id)}
                disabled={isProcessing}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Xác nhận đã thanh toán
              </button>
              <button
                onClick={() => handleReject(order.orderCode, order.id)}
                disabled={isProcessing}
                className="btn-secondary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                Từ chối
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
