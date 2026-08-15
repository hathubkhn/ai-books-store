import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";
import { z } from "zod";

const JWT_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || "your-customer-secret-key-change-this"
);

const assessmentSchema = z.object({
  trackSlug: z.string(),
  answers: z.array(
    z.object({
      questionId: z.string(),
      answer: z.string(),
    })
  ),
});

// POST /api/roadmap/assessment - Submit assessment and get recommendation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = assessmentSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const { trackSlug, answers } = validation.data;

    // Get track
    const track = await prisma.learningTrack.findUnique({
      where: { slug: trackSlug },
      include: {
        stages: {
          orderBy: { displayOrder: "asc" },
        },
      },
    });

    if (!track) {
      return NextResponse.json(
        { error: "Không tìm thấy lộ trình" },
        { status: 404 }
      );
    }

    // Calculate recommendation based on answers
    const recommendation = calculateRecommendation(answers, track);

    // Try to save progress for logged-in user
    const token = request.cookies.get("customer_token")?.value;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const customerId = payload.customerId as number;

        await prisma.customerRoadmapProgress.upsert({
          where: {
            customerId_trackId: {
              customerId,
              trackId: track.id,
            },
          },
          create: {
            customerId,
            trackId: track.id,
            assessmentData: { answers },
            recommendedLevel: recommendation.level,
            currentStageId: recommendation.startingStageId,
            completedStageIds: recommendation.completedStageIds,
          },
          update: {
            assessmentData: { answers },
            recommendedLevel: recommendation.level,
            currentStageId: recommendation.startingStageId,
            completedStageIds: recommendation.completedStageIds,
            lastAccessedAt: new Date(),
          },
        });
      } catch (authError) {
        // Not logged in, continue without saving
        console.log("User not logged in, assessment not saved");
      }
    }

    return NextResponse.json({
      success: true,
      recommendation,
    });
  } catch (error) {
    console.error("Assessment error:", error);
    return NextResponse.json(
      { error: "Lỗi xử lý đánh giá" },
      { status: 500 }
    );
  }
}

// Rule-based recommendation logic
function calculateRecommendation(
  answers: Array<{ questionId: string; answer: string }>,
  track: any
): {
  level: string;
  startingStageId: number;
  completedStageIds: number[];
} {
  // Simple rule-based scoring
  let score = 0;

  answers.forEach((answer) => {
    // Map answers to scores (0-3)
    if (answer.answer.includes("chưa") || answer.answer.includes("không")) {
      score += 0;
    } else if (
      answer.answer.includes("cơ bản") ||
      answer.answer.includes("biết")
    ) {
      score += 1;
    } else if (
      answer.answer.includes("thành thạo") ||
      answer.answer.includes("đã làm")
    ) {
      score += 2;
    } else if (
      answer.answer.includes("chuyên sâu") ||
      answer.answer.includes("nghiên cứu")
    ) {
      score += 3;
    }
  });

  const avgScore = score / answers.length;
  const stages = track.stages;

  let level: string;
  let startingStageIndex: number;
  let completedStageIds: number[] = [];

  // Determine level and starting point
  if (avgScore < 0.5) {
    level = "FOUNDATION";
    startingStageIndex = 0;
  } else if (avgScore < 1.5) {
    level = "BEGINNER";
    startingStageIndex = Math.min(1, stages.length - 1);
    completedStageIds = stages.slice(0, startingStageIndex).map((s: any) => s.id);
  } else if (avgScore < 2.5) {
    level = "INTERMEDIATE";
    startingStageIndex = Math.min(3, stages.length - 1);
    completedStageIds = stages.slice(0, startingStageIndex).map((s: any) => s.id);
  } else {
    level = "ADVANCED";
    startingStageIndex = Math.min(5, stages.length - 1);
    completedStageIds = stages.slice(0, startingStageIndex).map((s: any) => s.id);
  }

  return {
    level,
    startingStageId: stages[startingStageIndex]?.id,
    completedStageIds,
  };
}
