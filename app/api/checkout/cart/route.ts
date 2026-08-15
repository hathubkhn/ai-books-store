import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import { normalizeVietnamesePhone } from "@/lib/phone";
import { getCustomerPromotion } from "@/lib/promotion";
import { generateOrderCode } from "@/lib/order-code";
import { z } from "zod";

const JWT_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || "your-customer-secret-key-change-this"
);

const checkoutSchema = z.object({
  recipientName: z.string().min(1, "Vui lòng nhập họ tên"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  shippingAddress: z.string().min(5, "Vui lòng nhập địa chỉ nhận hàng"),
  alternativeAddress: z.string().optional(),
  province: z.string().optional(),
  note: z.string().optional(),
});

// POST /api/checkout/cart - Checkout with cart items
export async function POST(request: NextRequest) {
  try {
    // Get customer from token
    const token = request.cookies.get("customer_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const customerId = payload.customerId as number;

    // Validate input
    const body = await request.json();
    const validation = checkoutSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { recipientName, phone, shippingAddress, alternativeAddress, province, note } =
      validation.data;

    // Normalize phone
    const normalizedPhone = normalizeVietnamesePhone(phone);

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { customerId },
      include: {
        book: true,
      },
    });

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: "Giỏ hàng trống" },
        { status: 400 }
      );
    }

    // Calculate totals
    let subtotal = 0;
    const orderItems: Array<{
      bookId: number;
      bookTitle: string;
      unitPrice: any;
      quantity: number;
      lineTotal: number;
    }> = [];

    for (const item of cartItems) {
      if (!item.book.isActive) {
        return NextResponse.json(
          { error: `Sách "${item.book.title}" hiện không có sẵn` },
          { status: 400 }
        );
      }

      const lineTotal = item.book.price.toNumber() * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        bookId: item.bookId,
        bookTitle: item.book.title,
        unitPrice: item.book.price,
        quantity: item.quantity,
        lineTotal,
      });
    }

    // Check for promotions (using first book for now)
    const firstBook = cartItems[0].book;
    const promotion = await getCustomerPromotion(
      normalizedPhone,
      firstBook.id
    );

    const discountPercent = promotion.discountPercent || 0;
    const promotionType = promotion.promotionType || null;

    const discountAmount = Math.round((subtotal * discountPercent) / 100);
    const total = subtotal - discountAmount;

    // Get or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone: normalizedPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          fullName: recipientName,
          phone: normalizedPhone,
        },
      });
    }

    // Generate order code
    const orderCode = generateOrderCode();

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderCode,
          customerId: customer!.id,
          recipientName,
          phone: normalizedPhone,
          shippingAddress,
          alternativeAddress: alternativeAddress || null,
          province: province || null,
          note: note || null,
          subtotal,
          discountPercent,
          discountAmount,
          total,
          promotionType,
          status: "PENDING_PAYMENT",
          paymentMethod: "bank_transfer",
          items: {
            create: orderItems,
          },
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { customerId },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderCode: order.orderCode,
      message: "Đặt hàng thành công",
    });
  } catch (error) {
    console.error("Checkout cart error:", error);
    return NextResponse.json(
      { error: "Lỗi đặt hàng. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
