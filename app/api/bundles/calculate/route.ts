import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateBundlePrice } from "@/lib/bundle-pricing";
import { z } from "zod";

const calculateSchema = z.object({
  bundleSlug: z.string(),
  selectedBookIds: z.array(z.number()),
});

// POST /api/bundles/calculate - Calculate custom bundle price
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = calculateSchema.safeParse(body);

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

    // Prepare items for calculation
    const items = bundle.items.map((item) => ({
      bookId: item.bookId,
      price: item.book.price.toNumber(),
      isRequired: item.isRequired,
    }));

    // Calculate
    const calculation = calculateBundlePrice(
      items,
      selectedBookIds,
      bundle.discountType as "PERCENTAGE" | "FIXED_AMOUNT",
      bundle.discountValue.toNumber()
    );

    return NextResponse.json({
      success: true,
      calculation,
    });
  } catch (error) {
    console.error("Calculate bundle error:", error);
    return NextResponse.json(
      { error: "Lỗi tính giá combo" },
      { status: 500 }
    );
  }
}
