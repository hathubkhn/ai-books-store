import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/db";
import { Plus } from "lucide-react";

export default async function AdminCategoriesPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { books: true },
      },
    },
    orderBy: {
      sortOrder: "asc",
    },
  });

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-semibold">Categories</h1>
          <Link href="/admin/categories/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Category
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-foreground-secondary mb-4">No categories yet.</p>
            <Link href="/admin/categories/new" className="btn-primary inline-block">
              <Plus className="w-5 h-5 inline mr-2" />
              Add Your First Category
            </Link>
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Order</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Name</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Slug</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Books</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-border last:border-0">
                      <td className="py-3 font-mono text-sm">{category.sortOrder}</td>
                      <td className="py-3">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm text-foreground-secondary">{category.description}</div>
                      </td>
                      <td className="py-3 font-mono text-sm">{category.slug}</td>
                      <td className="py-3 text-sm">{category._count.books} books</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-sm text-xs font-medium ${
                          category.isActive ? "bg-success/10 text-success" : "bg-error/10 text-error"
                        }`}>
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/admin/categories/${category.id}/edit`}
                          className="text-accent hover:underline text-sm"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
