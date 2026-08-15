import { NextRequest, NextResponse } from "next/server";
import { authenticateCustomer } from "@/lib/customer-auth";
import { normalizeVietnamesePhone } from "@/lib/phone";
import { z } from "zod";
import { SignJWT } from "jose";

const loginSchema = z.object({
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

const JWT_SECRET = new TextEncoder().encode(
  process.env.CUSTOMER_JWT_SECRET || "your-customer-secret-key-change-this"
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { phone, password } = validation.data;
    const normalizedPhone = normalizeVietnamesePhone(phone);

    const customer = await authenticateCustomer(normalizedPhone, password);

    // Create JWT token
    const token = await new SignJWT({
      customerId: customer.id,
      phone: customer.phone,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        phone: customer.phone,
        fullName: customer.fullName,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set("customer_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Đăng nhập thất bại" },
      { status: 401 }
    );
  }
}
