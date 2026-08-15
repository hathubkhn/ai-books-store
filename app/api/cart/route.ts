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

// GET cart items
export async function GET(request: NextRequest) {
  try {
    const customerId = await getCustomerFromToken(request);

    const cartItems = await prisma.cartItem.findMany({
      where: { customerId },
      include: {
        book: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Serialize Decimal to number
    const serializedCart = cartItems.map((item) => ({
      ...item,
      book: {
        ...item.book,
        price: item.book.price.toNumber(),
      },
    }));

    return NextResponse.json({ cartItems: serializedCart });
  } catch (error) {
    console.error("Get cart error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi lấy giỏ hàng" },
      { status: 401 }
    );
  }
}

// POST add to cart
export async function POST(request: NextRequest) {
  try {
    const customerId = await getCustomerFromToken(request);
    const { bookId, quantity = 1 } = await request.json();

    if (!bookId) {
      return NextResponse.json({ error: "Thiếu thông tin sách" }, { status: 400 });
    }

    // Check if book exists and is active
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || !book.isActive) {
      return NextResponse.json({ error: "Sách không tồn tại" }, { status: 404 });
    }

    // Check if already in cart
    const existing = await prisma.cartItem.findUnique({
      where: {
        customerId_bookId: {
          customerId,
          bookId,
        },
      },
    });

    let cartItem;
    if (existing) {
      // Update quantity
      cartItem = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          customerId,
          bookId,
          quantity,
        },
      });
    }

    return NextResponse.json({ success: true, cartItem });
  } catch (error) {
    console.error("Add to cart error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Lỗi thêm vào giỏ hàng" },
      { status: 400 }
    );
  }
}
