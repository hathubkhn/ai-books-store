import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || "your-customer-secret-key-change-this"
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("customer_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const customerId = payload.customerId as number;

    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Serialize Decimals
    const serializedOrders = orders.map((order) => ({
      ...order,
      subtotal: order.subtotal.toNumber(),
      discountAmount: order.discountAmount.toNumber(),
      total: order.total.toNumber(),
      items: order.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice.toNumber(),
        lineTotal: item.lineTotal.toNumber(),
        book: {
          ...item.book,
          price: item.book.price.toNumber(),
        },
      })),
    }));

    return NextResponse.json({ orders: serializedOrders });
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Lỗi lấy lịch sử đơn hàng" }, { status: 500 });
  }
}
