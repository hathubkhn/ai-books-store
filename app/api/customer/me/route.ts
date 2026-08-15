import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/db";

const JWT_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || "your-customer-secret-key-change-this"
);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("customer_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const customerId = payload.customerId as number;

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: {
        id: true,
        phone: true,
        fullName: true,
        defaultAddress: true,
        province: true,
        createdAt: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ error: "Không tìm thấy tài khoản" }, { status: 404 });
    }

    return NextResponse.json({ customer });
  } catch (error) {
    console.error("Get customer error:", error);
    return NextResponse.json({ error: "Không xác thực" }, { status: 401 });
  }
}
