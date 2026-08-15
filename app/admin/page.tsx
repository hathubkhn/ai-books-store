import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/currency";
import { siteConfig } from "@/config/site";

export default async function AdminDashboard() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const [bookCount, orderCount, customerCount, totalRevenue, earlyBuyerStats] = await Promise.all([
    prisma.book.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.order.aggregate({
      _sum: { total: true },
    }),
    prisma.customer.count().then((count) => ({
      claimed: Math.min(count, siteConfig.earlyBuyerLimit),
      remaining: Math.max(0, siteConfig.earlyBuyerLimit - count),
    })),
  ]);

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  const revenue = Number(totalRevenue._sum.total || 0);

  return (
    <AdminLayout>
      <div>
        <h1 className="font-serif text-3xl font-semibold mb-8">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="text-sm text-foreground-secondary mb-1">Total Books</div>
            <div className="text-3xl font-serif font-semibold">{bookCount}</div>
          </div>

          <div className="card">
            <div className="text-sm text-foreground-secondary mb-1">Orders</div>
            <div className="text-3xl font-serif font-semibold">{orderCount}</div>
          </div>

          <div className="card">
            <div className="text-sm text-foreground-secondary mb-1">Customers</div>
            <div className="text-3xl font-serif font-semibold">{customerCount}</div>
          </div>

          <div className="card">
            <div className="text-sm text-foreground-secondary mb-1">Order Revenue</div>
            <div className="text-2xl font-serif font-semibold">{formatVND(revenue)}</div>
          </div>
        </div>

        {/* Early Buyer Progress */}
        <div className="card mb-8">
          <h2 className="font-semibold text-lg mb-4">Early Buyer Program</h2>
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-serif font-semibold">
              {earlyBuyerStats.claimed} / {siteConfig.earlyBuyerLimit}
            </span>
            <span className="text-foreground-secondary">
              {earlyBuyerStats.remaining} offers remaining
            </span>
          </div>
          <div className="w-full h-3 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${(earlyBuyerStats.claimed / siteConfig.earlyBuyerLimit) * 100}%` }}
            />
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h2 className="font-semibold text-lg mb-4">Recent Orders</h2>
          
          {recentOrders.length === 0 ? (
            <p className="text-foreground-secondary text-center py-8">No orders yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Order</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Customer</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Phone</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Total</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-mono text-sm">{order.orderCode}</td>
                      <td className="py-3">{order.customer.fullName}</td>
                      <td className="py-3 font-mono text-sm">{order.phone.slice(0, 7)}...</td>
                      <td className="py-3 font-semibold">{formatVND(Number(order.total))}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-sm text-xs font-medium ${
                          order.status === "COMPLETED" ? "bg-success/10 text-success" :
                          order.status === "CANCELLED" ? "bg-error/10 text-error" :
                          "bg-warning/10 text-warning"
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
