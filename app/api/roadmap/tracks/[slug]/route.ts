import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/roadmap/tracks/[slug] - Get track detail with stages
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const track = await prisma.learningTrack.findUnique({
      where: { slug },
      include: {
        stages: {
          orderBy: { displayOrder: "asc" },
          include: {
            bookMappings: {
              where: {
                book: {
                  isActive: true,
                },
              },
              orderBy: { recommendationPriority: "desc" },
              take: 3, // Top 3 books per stage
              include: {
                book: {
                  include: {
                    category: true,
                  },
                },
              },
            },
          },
        },
        bundles: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
          include: {
            items: {
              orderBy: { displayOrder: "asc" },
              include: {
                book: true,
              },
            },
          },
        },
      },
    });

    if (!track) {
      return NextResponse.json(
        { error: "Không tìm thấy lộ trình" },
        { status: 404 }
      );
    }

    // Serialize Decimals
    const serializedTrack = {
      ...track,
      stages: track.stages.map((stage) => ({
        ...stage,
        bookMappings: stage.bookMappings.map((mapping) => ({
          ...mapping,
          book: {
            ...mapping.book,
            price: mapping.book.price.toNumber(),
          },
        })),
      })),
      bundles: track.bundles.map((bundle) => ({
        ...bundle,
        discountValue: bundle.discountValue.toNumber(),
        items: bundle.items.map((item) => ({
          ...item,
          book: {
            ...item.book,
            price: item.book.price.toNumber(),
          },
        })),
      })),
    };

    return NextResponse.json({ track: serializedTrack });
  } catch (error) {
    console.error("Get track error:", error);
    return NextResponse.json(
      { error: "Lỗi lấy thông tin lộ trình" },
      { status: 500 }
    );
  }
}
