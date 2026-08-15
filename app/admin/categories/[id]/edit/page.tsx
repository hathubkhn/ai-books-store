import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/db";
import CategoryForm from "@/components/admin/CategoryForm";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    notFound();
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    notFound();
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="font-serif text-3xl font-semibold mb-8">Edit Category</h1>
        <CategoryForm category={category} />
      </div>
    </AdminLayout>
  );
}
