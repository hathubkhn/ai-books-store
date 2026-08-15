import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/orders/[orderCode] - Get order by code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderCode: string }> }
) {
  try {
    const { orderCode } = await params;

    const order = await prisma.order.findUnique({
      where: { orderCode },
      include: {
        items: {
          include: {
            book: true,
          },
        },
        customer: {
          select: {
            id: true,
            fullName: true,
            phone: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Không tìm thấy đơn hàng" },
        { status: 404 }
      );
    }

    // Serialize Decimals
    const serializedOrder = {
      ...order,
      subtotal: order.subtotal.toNumber(),
      discountAmount: order.discountAmount.toNumber(),
      total: order.total.toNumber(),
      finalAmount: order.total.toNumber(), // Alias for compatibility
      items: order.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toNumber(),
        lineTotal: item.lineTotal.toNumber(),
      })),
    };

    return NextResponse.json({ order: serializedOrder });
  } catch (error) {
    console.error("Get order error:", error);
    return NextResponse.json(
      { error: "Lỗi lấy thông tin đơn hàng" },
      { status: 500 }
    );
  }
}
