import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/bundles - List all active bundles
export async function GET() {
  try {
    const bundlesRaw = await prisma.bookBundle.findMany({
      where: { isActive: true },
      include: {
        track: true,
        items: {
          orderBy: { displayOrder: "asc" },
          include: {
            book: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    });

    // Serialize Decimals
    const bundles = bundlesRaw.map((bundle) => ({
      ...bundle,
      discountValue: bundle.discountValue.toNumber(),
      items: bundle.items.map((item) => ({
        ...item,
        book: {
          ...item.book,
          price: item.book.price.toNumber(),
        },
      })),
    }));

    return NextResponse.json({ bundles });
  } catch (error) {
    console.error("Get bundles error:", error);
    return NextResponse.json(
      { error: "Lỗi lấy danh sách combo" },
      { status: 500 }
    );
  }
}
