import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/bundles/[slug] - Get bundle detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const bundleRaw = await prisma.bookBundle.findUnique({
      where: { slug },
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
    });

    if (!bundleRaw) {
      return NextResponse.json(
        { error: "Không tìm thấy combo" },
        { status: 404 }
      );
    }

    // Serialize Decimals
    const bundle = {
      ...bundleRaw,
      discountValue: bundleRaw.discountValue.toNumber(),
      items: bundleRaw.items.map((item) => ({
        ...item,
        book: {
          ...item.book,
          price: item.book.price.toNumber(),
        },
      })),
    };

    return NextResponse.json({ bundle });
  } catch (error) {
    console.error("Get bundle error:", error);
    return NextResponse.json(
      { error: "Lỗi lấy thông tin combo" },
      { status: 500 }
    );
  }
}
