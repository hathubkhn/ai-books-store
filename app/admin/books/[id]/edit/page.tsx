import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/db";
import BookEditForm from "@/components/admin/BookEditForm";

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const bookId = parseInt(id);

  if (isNaN(bookId)) {
    notFound();
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: { category: true },
  });

  if (!book) {
    notFound();
  }

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  // Serialize Decimal to number
  const serializedBook = {
    ...book,
    price: book.price.toNumber(),
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="font-serif text-3xl font-semibold mb-8">Edit Book</h1>
        <BookEditForm book={serializedBook} categories={categories} />
      </div>
    </AdminLayout>
  );
}
