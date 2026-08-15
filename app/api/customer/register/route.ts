import { NextRequest, NextResponse } from "next/server";
import { registerCustomer } from "@/lib/customer-auth";
import { normalizeVietnamesePhone } from "@/lib/phone";
import { z } from "zod";

const registerSchema = z.object({
  phone: z.string().min(1, "Vui lòng nhập số điện thoại"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { phone, password, fullName } = validation.data;
    const normalizedPhone = normalizeVietnamesePhone(phone);

    const customer = await registerCustomer(normalizedPhone, password, fullName);

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        phone: customer.phone,
        fullName: customer.fullName,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Đăng ký thất bại" },
      { status: 400 }
    );
  }
}
