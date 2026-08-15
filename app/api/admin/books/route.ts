import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { bookSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validation = bookSchema.safeParse(body);

    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return NextResponse.json({ errors }, { status: 400 });
    }

    const book = await prisma.book.create({
      data: {
        ...validation.data,
        isbn: validation.data.isbn || null,
        publishedYear: validation.data.publishedYear || null,
        audience: validation.data.audience || null,
      },
    });

    return NextResponse.json({ book });
  } catch (error: any) {
    console.error("Create book error:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 });
  }
}
