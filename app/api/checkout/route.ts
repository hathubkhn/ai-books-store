import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkoutSchema } from "@/lib/validation";
import { normalizeVietnamesePhone, isValidVietnamesePhone } from "@/lib/phone";
import { getCustomerPromotion, calculateOrderTotal } from "@/lib/promotion";
import { generateOrderCode } from "@/lib/order-code";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = checkoutSchema.safeParse(body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    const data = validation.data;

    // Validate phone
    if (!isValidVietnamesePhone(data.phone)) {
      return NextResponse.json(
        { error: "Invalid Vietnamese phone number" },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizeVietnamesePhone(data.phone);

    // Get book
    const book = await prisma.book.findUnique({
      where: { slug: data.bookSlug },
    });

    if (!book || !book.isActive) {
      return NextResponse.json(
        { error: "Book not found or unavailable" },
        { status: 404 }
      );
    }

    // Get promotion for this specific book
    const promotion = await getCustomerPromotion(normalizedPhone, book.id);

    // Calculate totals (server-side, never trust client)
    const unitPrice = Number(book.price);
    const { subtotal, discountAmount, total } = calculateOrderTotal(
      unitPrice,
      data.quantity,
      promotion.discountPercent
    );

    // Generate order code
    let orderCode = generateOrderCode();
    
    // Ensure uniqueness
    let attempts = 0;
    while (attempts < 10) {
      const existing = await prisma.order.findUnique({
        where: { orderCode },
      });
      if (!existing) break;
      orderCode = generateOrderCode();
      attempts++;
    }

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Find or create customer
      let customer = await tx.customer.findUnique({
        where: { phone: normalizedPhone },
      });

      if (!customer) {
        customer = await tx.customer.create({
          data: {
            fullName: data.fullName,
            phone: normalizedPhone,
            defaultAddress: data.shippingAddress,
            province: data.province || null,
          },
        });
      } else {
        // Update customer info if needed
        await tx.customer.update({
          where: { id: customer.id },
          data: {
            fullName: data.fullName,
            defaultAddress: data.shippingAddress,
            province: data.province || null,
          },
        });
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderCode,
          customerId: customer.id,
          recipientName: data.fullName,
          phone: normalizedPhone,
          shippingAddress: data.shippingAddress,
          alternativeAddress: data.alternativeAddress || null,
          province: data.province || null,
          note: data.note || null,
          subtotal,
          discountPercent: promotion.discountPercent,
          discountAmount,
          total,
          promotionType: promotion.promotionType,
          status: "PENDING",
          items: {
            create: {
              bookId: book.id,
              bookTitle: book.title,
              unitPrice,
              quantity: data.quantity,
              lineTotal: subtotal,
            },
          },
        },
        include: {
          items: true,
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      orderCode: order.orderCode,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create order. Please try again." },
      { status: 500 }
    );
  }
}
