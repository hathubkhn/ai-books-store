"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface OrderStatusUpdaterProps {
  order: {
    id: number;
    orderCode: string;
    status: string;
  };
}

const ORDER_STATUSES = [
  { value: "PENDING_PAYMENT", label: "Pending Payment" },
  { value: "PAYMENT_CONFIRMED", label: "Payment Confirmed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "PACKING", label: "Packing" },
  { value: "SHIPPING", label: "Shipping" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function OrderStatusUpdater({ order }: OrderStatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === status) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/orders/${order.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setStatus(newStatus);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="p-3 bg-error/10 border border-error/20 rounded-sm text-error text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {ORDER_STATUSES.map((statusOption) => (
          <button
            key={statusOption.value}
            onClick={() => handleStatusChange(statusOption.value)}
            disabled={loading}
            className={`w-full text-left px-4 py-2 rounded-sm text-sm transition-colors ${
              status === statusOption.value
                ? "bg-accent text-white"
                : "bg-surface hover:bg-surface-light"
            } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between`}
          >
            <span>{statusOption.label}</span>
            {loading && status === statusOption.value && (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
