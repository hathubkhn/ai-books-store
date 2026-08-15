import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import { prisma } from "@/lib/db";
import { formatVND } from "@/lib/currency";
import { Plus } from "lucide-react";

export default async function AdminBooksPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  const books = await prisma.book.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-semibold">Books</h1>
          <Link href="/admin/books/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Book
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-foreground-secondary mb-4">No books yet.</p>
            <Link href="/admin/books/new" className="btn-primary inline-block">
              <Plus className="w-5 h-5 inline mr-2" />
              Add Your First Book
            </Link>
          </div>
        ) : (
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Title</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Category</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Price</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Status</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Featured</th>
                    <th className="text-left py-3 text-sm font-medium text-foreground-secondary">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id} className="border-b border-border last:border-0">
                      <td className="py-3">
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-foreground-secondary">{book.authors}</div>
                      </td>
                      <td className="py-3 text-sm">{book.category.name}</td>
                      <td className="py-3 font-semibold">{formatVND(Number(book.price))}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-sm text-xs font-medium ${
                          book.isActive ? "bg-success/10 text-success" : "bg-error/10 text-error"
                        }`}>
                          {book.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 text-sm">
                        {book.featured ? "Yes" : "No"}
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/admin/books/${book.id}/edit`}
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
