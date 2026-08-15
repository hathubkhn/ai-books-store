import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || "your-customer-secret-key-change-this"
);

// GET /api/roadmap/progress - Get all progress for current user
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("customer_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const customerId = payload.customerId as number;

    const progress = await prisma.customerRoadmapProgress.findMany({
      where: { customerId },
      include: {
        track: {
          include: {
            stages: {
              orderBy: { displayOrder: "asc" },
            },
          },
        },
      },
      orderBy: { lastAccessedAt: "desc" },
    });

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Get progress error:", error);
    return NextResponse.json(
      { error: "Lỗi lấy tiến độ học tập" },
      { status: 500 }
    );
  }
}

// POST /api/roadmap/progress - Update progress
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("customer_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const customerId = payload.customerId as number;

    const body = await request.json();
    const { trackId, currentStageId, completedStageIds, ownedBookIds } = body;

    const progress = await prisma.customerRoadmapProgress.upsert({
      where: {
        customerId_trackId: {
          customerId,
          trackId: parseInt(trackId),
        },
      },
      create: {
        customerId,
        trackId: parseInt(trackId),
        currentStageId: currentStageId ? parseInt(currentStageId) : null,
        completedStageIds: completedStageIds || [],
        ownedBookIds: ownedBookIds || [],
      },
      update: {
        currentStageId: currentStageId ? parseInt(currentStageId) : undefined,
        completedStageIds: completedStageIds || undefined,
        ownedBookIds: ownedBookIds || undefined,
        lastAccessedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error("Update progress error:", error);
    return NextResponse.json(
      { error: "Lỗi cập nhật tiến độ" },
      { status: 500 }
    );
  }
}
