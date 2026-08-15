import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import { z } from "zod";

const JWT_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || "your-customer-secret-key-change-this"
);

const addBundleSchema = z.object({
  bundleSlug: z.string(),
  selectedBookIds: z.array(z.number()),
});

// POST /api/bundles/add-to-cart - Add entire bundle to cart
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("customer_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const customerId = payload.customerId as number;

    const body = await request.json();
    const validation = addBundleSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { bundleSlug, selectedBookIds } = validation.data;

    // Get bundle
    const bundle = await prisma.bookBundle.findUnique({
      where: { slug: bundleSlug },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!bundle) {
      return NextResponse.json(
        { error: "Không tìm thấy combo" },
        { status: 404 }
      );
    }

    // Filter selected items
    const selectedItems = bundle.items.filter((item) =>
      selectedBookIds.includes(item.bookId)
    );

    if (selectedItems.length === 0) {
      return NextResponse.json(
        { error: "Vui lòng chọn ít nhất một cuốn sách" },
        { status: 400 }
      );
    }

    // Add each book to cart
    const addedItems = [];
    for (const item of selectedItems) {
      if (!item.book.isActive) {
        continue; // Skip inactive books
      }

      const cartItem = await prisma.cartItem.upsert({
        where: {
          customerId_bookId: {
            customerId,
            bookId: item.bookId,
          },
        },
        create: {
          customerId,
          bookId: item.bookId,
          quantity: 1,
        },
        update: {
          quantity: {
            increment: 1,
          },
        },
      });

      addedItems.push(cartItem);
    }

    return NextResponse.json({
      success: true,
      addedCount: addedItems.length,
      message: `Đã thêm ${addedItems.length} cuốn sách vào giỏ hàng`,
    });
  } catch (error) {
    console.error("Add bundle to cart error:", error);
    return NextResponse.json(
      { error: "Lỗi thêm combo vào giỏ hàng" },
      { status: 500 }
    );
  }
}
