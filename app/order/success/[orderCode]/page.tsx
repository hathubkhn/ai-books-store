import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/currency";
import { maskPhone } from "@/lib/phone";
import { CheckCircle } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Successful",
  description: "Your order has been placed successfully",
};

interface OrderSuccessPageProps {
  params: Promise<{ orderCode: string }>;
}

export default async function OrderSuccessPage({ params }: OrderSuccessPageProps) {
  const { orderCode } = await params;
  
  const order = await prisma.order.findUnique({
    where: { orderCode },
    include: {
      items: {
        include: {
          book: true,
        },
      },
      customer: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="section-padding min-h-screen">
        <div className="container-custom max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-6">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            
            <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-4">
              Order Placed Successfully
            </h1>
            
            <p className="text-foreground-secondary text-lg">
              We have received your order. Your book will be prepared and shipped to the registered address.
            </p>
          </div>

          <div className="card space-y-6">
            <div>
              <h2 className="font-semibold mb-2">Order Code</h2>
              <p className="text-2xl font-mono text-accent">{order.orderCode}</p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Order Details</h3>
              
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <p className="font-medium">{item.bookTitle}</p>
                    <p className="text-sm text-foreground-secondary">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatVND(Number(item.lineTotal))}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Recipient Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-foreground-secondary">Name:</span> {order.recipientName}
                </p>
                <p>
                  <span className="text-foreground-secondary">Phone:</span> {maskPhone(order.phone)}
                </p>
                <p>
                  <span className="text-foreground-secondary">Address:</span> {order.shippingAddress}
                </p>
                {order.province && (
                  <p>
                    <span className="text-foreground-secondary">Province:</span> {order.province}
                  </p>
                )}
                {order.note && (
                  <p>
                    <span className="text-foreground-secondary">Note:</span> {order.note}
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatVND(Number(order.subtotal))}</span>
                </div>
                
                {order.discountPercent > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>{order.discountPercent}% discount</span>
                    <span>-{formatVND(Number(order.discountAmount))}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-semibold text-lg pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-accent">{formatVND(Number(order.total))}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/books" className="btn-primary inline-block">
              Continue Exploring Books
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
