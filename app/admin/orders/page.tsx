import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/currency";

export default async function AdminOrdersPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      items: {
        include: {
          book: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "bg-yellow-500/10 text-yellow-600",
    PAYMENT_CONFIRMED: "bg-blue-500/10 text-blue-600",
    CONFIRMED: "bg-blue-500/10 text-blue-600",
    PACKING: "bg-purple-500/10 text-purple-600",
    SHIPPING: "bg-indigo-500/10 text-indigo-600",
    COMPLETED: "bg-success/10 text-success",
    CANCELLED: "bg-error/10 text-error",
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-semibold">Orders</h1>
          <Link
            href="/admin/payments"
            className="btn-primary"
          >
            Payment Confirmations
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-sm text-foreground-secondary mb-1">Total Orders</div>
            <div className="text-3xl font-serif font-semibold">{orders.length}</div>
          </div>
          <div className="card">
            <div className="text-sm text-foreground-secondary mb-1">Pending Payment</div>
            <div className="text-3xl font-serif font-semibold">
              {orders.filter(o => o.status === "PENDING_PAYMENT").length}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-foreground-secondary mb-1">In Progress</div>
            <div className="text-3xl font-serif font-semibold">
              {orders.filter(o => ["PAYMENT_CONFIRMED", "CONFIRMED", "PACKING", "SHIPPING"].includes(o.status)).length}
            </div>
          </div>
          <div className="card">
            <div className="text-sm text-foreground-secondary mb-1">Completed</div>
            <div className="text-3xl font-serif font-semibold">
              {orders.filter(o => o.status === "COMPLETED").length}
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-foreground-secondary">No orders yet.</p>
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Order Code</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Customer</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Items</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Total</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Payment</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Date</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-mono text-sm">{order.orderCode}</td>
                      <td className="py-3">
                        <div className="font-medium">{order.customer.fullName}</div>
                        <div className="text-sm text-foreground-secondary">{order.phone}</div>
                      </td>
                      <td className="py-3 text-sm">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                      </td>
                      <td className="py-3 font-semibold">{formatVND(Number(order.total))}</td>
                      <td className="py-3 text-sm capitalize">
                        {order.paymentMethod?.replace("_", " ") || "N/A"}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-sm text-xs font-medium ${
                          statusColors[order.status] || "bg-gray-500/10 text-gray-600"
                        }`}>
                          {order.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-foreground-secondary">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-accent hover:underline text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
