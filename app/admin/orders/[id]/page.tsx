import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/currency";
import BookCover from "@/components/books/BookCover";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";
import { ArrowLeft } from "lucide-react";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const orderId = parseInt(id);

  if (isNaN(orderId)) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <AdminLayout>
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold">Order #{order.orderCode}</h1>
            <p className="text-foreground-secondary mt-1">
              Placed on {new Date(order.createdAt).toLocaleString("en-US", {
                dateStyle: "long",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="font-semibold text-lg mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-16 h-24 flex-shrink-0">
                      <BookCover
                        src={item.book.coverImage}
                        alt={item.bookTitle}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{item.bookTitle}</h3>
                      <p className="text-sm text-foreground-secondary mb-2">
                        Quantity: {item.quantity} × {formatVND(Number(item.unitPrice))}
                      </p>
                      <p className="font-semibold text-accent">
                        {formatVND(Number(item.lineTotal))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-secondary">Subtotal</span>
                  <span>{formatVND(Number(order.subtotal))}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Discount ({order.discountPercent}%)</span>
                    <span>-{formatVND(Number(order.discountAmount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2">
                  <span>Total</span>
                  <span className="text-accent">{formatVND(Number(order.total))}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            {order.paymentMethod === "bank_transfer" && (
              <div className="card">
                <h2 className="font-semibold text-lg mb-4">Payment Information</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground-secondary">Method</span>
                    <span>Bank Transfer</span>
                  </div>
                  {order.paymentConfirmedAt && (
                    <div className="flex justify-between">
                      <span className="text-foreground-secondary">Confirmed At</span>
                      <span>
                        {new Date(order.paymentConfirmedAt).toLocaleString("en-US", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>
                  )}
                  {order.paymentProof && (
                    <div>
                      <p className="text-foreground-secondary mb-2">Payment Proof</p>
                      <a
                        href={order.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline"
                      >
                        View proof
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <div className="card">
              <h2 className="font-semibold text-lg mb-4">Order Status</h2>
              <OrderStatusUpdater order={{
                id: order.id,
                orderCode: order.orderCode,
                status: order.status,
              }} />
            </div>

            {/* Customer Info */}
            <div className="card">
              <h2 className="font-semibold text-lg mb-4">Customer</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-foreground-secondary">Name</p>
                  <p className="font-medium">{order.recipientName}</p>
                </div>
                <div>
                  <p className="text-foreground-secondary">Phone</p>
                  <p className="font-mono">{order.phone}</p>
                </div>
                <div>
                  <p className="text-foreground-secondary">Email</p>
                  <p className="font-mono">{order.customer.phone}</p>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="card">
              <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
              <div className="text-sm">
                <p className="font-medium mb-1">{order.recipientName}</p>
                <p className="text-foreground-secondary">{order.shippingAddress}</p>
                {order.alternativeAddress && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-foreground-secondary text-xs mb-1">Alternative Address</p>
                    <p className="text-foreground-secondary">{order.alternativeAddress}</p>
                  </div>
                )}
                {order.province && (
                  <p className="text-foreground-secondary mt-2">{order.province}</p>
                )}
                <p className="font-mono mt-2">{order.phone}</p>
              </div>
              {order.note && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-foreground-secondary text-xs mb-1">Note</p>
                  <p className="text-sm">{order.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
