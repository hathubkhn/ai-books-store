import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().min(1, "Description is required"),
  sortOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

// POST /api/admin/categories - Create category
export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = categorySchema.safeParse(body);

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Check if slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "Slug already in use" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: validation.data,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
