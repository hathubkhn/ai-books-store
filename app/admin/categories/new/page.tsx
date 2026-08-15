import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminLayout from "@/components/admin/AdminLayout";
import CategoryForm from "@/components/admin/CategoryForm";

export default async function NewCategoryPage() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="font-serif text-3xl font-semibold mb-8">Add New Category</h1>
        <CategoryForm />
      </div>
    </AdminLayout>
  );
}
