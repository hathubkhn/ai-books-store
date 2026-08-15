import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// POST /api/admin/confirm-payment - Confirm payment received
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderCode } = body;

    if (!orderCode) {
      return NextResponse.json(
        { error: "Order code required" },
        { status: 400 }
      );
    }

    // Find order
    const order = await prisma.order.findUnique({
      where: { orderCode },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: `Order already ${order.status}` },
        { status: 400 }
      );
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { orderCode },
      data: {
        status: "PAYMENT_CONFIRMED",
        paymentConfirmedAt: new Date(),
        paymentConfirmedBy: session.user.email || "admin",
      },
    });

    // TODO: Send email/SMS notification to customer
    // TODO: Trigger order processing workflow

    return NextResponse.json({
      success: true,
      message: "Payment confirmed successfully",
      orderCode: updatedOrder.orderCode,
    });
  } catch (error) {
    console.error("Confirm payment error:", error);
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    );
  }
}
