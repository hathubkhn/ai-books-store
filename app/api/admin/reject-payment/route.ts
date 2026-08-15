import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// POST /api/admin/reject-payment - Reject payment/order
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderCode, reason } = body;

    if (!orderCode || !reason) {
      return NextResponse.json(
        { error: "Order code and reason required" },
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
        { error: `Cannot reject order with status ${order.status}` },
        { status: 400 }
      );
    }

    // Update order status to CANCELLED
    const updatedOrder = await prisma.order.update({
      where: { orderCode },
      data: {
        status: "CANCELLED",
        note: order.note
          ? `${order.note}\n\n[Admin rejected: ${reason}]`
          : `[Admin rejected: ${reason}]`,
      },
    });

    // TODO: Send email/SMS notification to customer with reason
    // TODO: Log rejection for audit trail

    return NextResponse.json({
      success: true,
      message: "Order rejected successfully",
      orderCode: updatedOrder.orderCode,
    });
  } catch (error) {
    console.error("Reject payment error:", error);
    return NextResponse.json(
      { error: "Failed to reject order" },
      { status: 500 }
    );
  }
}
