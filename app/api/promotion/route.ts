import { NextRequest, NextResponse } from "next/server";
import { getCustomerPromotion } from "@/lib/promotion";
import { isValidVietnamesePhone } from "@/lib/phone";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const phone = searchParams.get("phone");
  const bookSlug = searchParams.get("bookSlug");

  if (!phone) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 }
    );
  }

  if (!isValidVietnamesePhone(phone)) {
    return NextResponse.json(
      { error: "Invalid phone number" },
      { status: 400 }
    );
  }

  try {
    let bookId: number | undefined;
    
    if (bookSlug) {
      const book = await prisma.book.findUnique({
        where: { slug: bookSlug },
        select: { id: true },
      });
      bookId = book?.id;
    }

    const promotion = await getCustomerPromotion(phone, bookId);
    return NextResponse.json(promotion);
  } catch (error) {
    console.error("Promotion check error:", error);
    return NextResponse.json(
      { error: "Failed to check promotion" },
      { status: 500 }
    );
  }
}
