import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/roadmap/tracks - List all learning tracks
export async function GET() {
  try {
    const tracks = await prisma.learningTrack.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
      include: {
        _count: {
          select: {
            stages: true,
          },
        },
      },
    });

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Get tracks error:", error);
    return NextResponse.json(
      { error: "Lỗi lấy danh sách lộ trình" },
      { status: 500 }
    );
  }
}
