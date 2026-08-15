import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/db";
import PaymentConfirmationList from "@/components/admin/PaymentConfirmationList";

export default async function AdminPaymentsPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/admin/login");
  }

  // Get pending payment orders
  const pendingOrders = await prisma.order.findMany({
    where: {
      status: "PENDING_PAYMENT",
    },
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

  // Serialize Decimals
  const serializedOrders = pendingOrders.map((order) => ({
    ...order,
    subtotal: order.subtotal.toNumber(),
    discountAmount: order.discountAmount.toNumber(),
    total: order.total.toNumber(),
    items: order.items.map((item) => ({
      ...item,
      unitPrice: item.unitPrice.toNumber(),
      lineTotal: item.lineTotal.toNumber(),
    })),
  }));

  // Get recently confirmed orders (last 24 hours)
  const recentlyConfirmed = await prisma.order.findMany({
    where: {
      status: "PAYMENT_CONFIRMED",
      paymentConfirmedAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
    include: {
      customer: true,
    },
    orderBy: {
      paymentConfirmedAt: "desc",
    },
    take: 10,
  });

  const serializedConfirmed = recentlyConfirmed.map((order) => ({
    ...order,
    subtotal: order.subtotal.toNumber(),
    discountAmount: order.discountAmount.toNumber(),
    total: order.total.toNumber(),
  }));

  return (
    <>
      <Header />
      <main className="section-padding min-h-screen bg-surface-light">
        <div className="container-custom max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-2">
              Payment Confirmations
            </h1>
            <p className="text-foreground-secondary">
              Review and confirm bank transfer payments
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card">
              <p className="text-sm text-foreground-secondary mb-2">
                Pending Payments
              </p>
              <p className="text-3xl font-bold text-accent">
                {pendingOrders.length}
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-foreground-secondary mb-2">
                Total Pending Amount
              </p>
              <p className="text-3xl font-bold">
                {pendingOrders
                  .reduce((sum, order) => sum + order.total.toNumber(), 0)
                  .toLocaleString("vi-VN")}
                ₫
              </p>
            </div>
            <div className="card">
              <p className="text-sm text-foreground-secondary mb-2">
                Confirmed Today (24h)
              </p>
              <p className="text-3xl font-bold text-green-600">
                {recentlyConfirmed.length}
              </p>
            </div>
          </div>

          {/* Pending Payments Section */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Pending Payments
            </h2>
            {pendingOrders.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-foreground-secondary">
                  No pending payments at the moment
                </p>
              </div>
            ) : (
              <PaymentConfirmationList orders={serializedOrders} />
            )}
          </div>

          {/* Recently Confirmed Section */}
          <div>
            <h2 className="font-serif text-2xl font-semibold mb-4">
              Recently Confirmed (Last 24h)
            </h2>
            {recentlyConfirmed.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-foreground-secondary">
                  No recent confirmations
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {serializedConfirmed.map((order) => (
                  <div key={order.id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{order.orderCode}</p>
                        <p className="text-sm text-foreground-secondary">
                          {order.customer.fullName} - {order.customer.phone}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {order.total.toLocaleString("vi-VN")}₫
                        </p>
                        <p className="text-xs text-foreground-secondary">
                          Confirmed by {order.paymentConfirmedBy}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
