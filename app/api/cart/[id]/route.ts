import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || "your-customer-secret-key-change-this"
);

async function getCustomerFromToken(request: NextRequest) {
  const token = request.cookies.get("customer_token")?.value;
  if (!token) {
    throw new Error("Chưa đăng nhập");
  }

  const { payload } = await jwtVerify(token, JWT_SECRET);
  return payload.customerId as number;
}

// PATCH update cart item quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customerId = await getCustomerFromToken(request);
    const { id } = await params;
    const { quantity } = await request.json();

    if (quantity < 1) {
      return NextResponse.json({ error: "Số lượng không hợp lệ" }, { status: 400 });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cartItem || cartItem.customerId !== customerId) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    const updated = await prisma.cartItem.update({
      where: { id: parseInt(id) },
      data: { quantity },
    });

    return NextResponse.json({ success: true, cartItem: updated });
  } catch (error) {
    console.error("Update cart error:", error);
    return NextResponse.json({ error: "Lỗi cập nhật giỏ hàng" }, { status: 400 });
  }
}

// DELETE remove from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const customerId = await getCustomerFromToken(request);
    const { id } = await params;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: parseInt(id) },
    });

    if (!cartItem || cartItem.customerId !== customerId) {
      return NextResponse.json({ error: "Không tìm thấy" }, { status: 404 });
    }

    await prisma.cartItem.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete cart error:", error);
    return NextResponse.json({ error: "Lỗi xóa khỏi giỏ hàng" }, { status: 400 });
  }
}
