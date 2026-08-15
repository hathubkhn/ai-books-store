import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  shippingAddress: z.string().min(10, "Shipping address must be at least 10 characters"),
  alternativeAddress: z.string().optional(),
  province: z.string().optional(),
  note: z.string().max(500, "Note must be less than 500 characters").optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").max(20, "Maximum 20 books per order"),
  bookSlug: z.string(),
});

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes only"),
  publisher: z.string().min(1, "Publisher is required"),
  authors: z.string().min(1, "Authors are required"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  fullDescription: z.string().min(20, "Full description must be at least 20 characters"),
  coverImage: z.string().min(1, "Cover image is required"),
  price: z.number().positive("Price must be positive"),
  categoryId: z.number().int().positive("Category is required"),
  isbn: z.string().optional(),
  publishedYear: z.number().int().min(1900).max(2100).optional(),
  audience: z.string().optional(),
  translationSource: z.string().optional(),
  originalTitle: z.string().optional(),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and dashes only"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sortOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
