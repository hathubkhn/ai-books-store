import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ books: [] });
  }

  try {
    const booksRaw = await prisma.book.findMany({
      where: {
        isActive: true,
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            authors: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            publisher: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            shortDescription: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      include: {
        category: true,
      },
      take: 20,
    });

    // Serialize Decimal to number for JSON response
    const books = booksRaw.map((book) => ({
      ...book,
      price: book.price.toNumber(),
    }));

    return NextResponse.json({ books });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ books: [], error: "Search failed" }, { status: 500 });
  }
}
