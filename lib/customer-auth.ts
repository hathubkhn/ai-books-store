import bcrypt from "bcryptjs";
import { prisma } from "./db";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function registerCustomer(phone: string, password: string, fullName: string) {
  // Check if customer already exists
  const existing = await prisma.customer.findUnique({
    where: { phone },
  });

  if (existing && existing.password) {
    throw new Error("Số điện thoại đã được đăng ký");
  }

  const hashedPassword = await hashPassword(password);

  if (existing) {
    // Update existing customer with password
    return prisma.customer.update({
      where: { phone },
      data: {
        password: hashedPassword,
        fullName,
      },
    });
  }

  // Create new customer
  return prisma.customer.create({
    data: {
      phone,
      password: hashedPassword,
      fullName,
    },
  });
}

export async function authenticateCustomer(phone: string, password: string) {
  const customer = await prisma.customer.findUnique({
    where: { phone },
  });

  if (!customer || !customer.password) {
    throw new Error("Số điện thoại hoặc mật khẩu không đúng");
  }

  const isValid = await verifyPassword(password, customer.password);

  if (!isValid) {
    throw new Error("Số điện thoại hoặc mật khẩu không đúng");
  }

  return customer;
}
