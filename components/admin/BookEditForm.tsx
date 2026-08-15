"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Book {
  id: number;
  title: string;
  slug: string;
  publisher: string;
  authors: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  price: number;
  isbn: string | null;
  publishedYear: number | null;
  audience: string | null;
  translationSource: string | null;
  originalTitle: string | null;
  featured: boolean;
  isActive: boolean;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface BookEditFormProps {
  book: Book;
  categories: Category[];
}

export default function BookEditForm({ book, categories }: BookEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(book);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update book");
      }

      router.push("/admin/books");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      {error && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-sm text-error mb-6">
          {error}
        </div>
      )}

      <div className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Authors <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="authors"
              required
              value={formData.authors}
              onChange={handleChange}
              className="input-field"
              placeholder="John Doe, Jane Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Publisher <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="publisher"
              required
              value={formData.publisher}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="categoryId"
            required
            value={formData.categoryId}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Short Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="shortDescription"
            required
            value={formData.shortDescription}
            onChange={handleChange}
            className="input-field"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Full Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="fullDescription"
            required
            value={formData.fullDescription}
            onChange={handleChange}
            className="input-field"
            rows={6}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Cover Image URL <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="coverImage"
              required
              value={formData.coverImage}
              onChange={handleChange}
              className="input-field"
              placeholder="/images/books/example.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Price (VND) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              required
              value={formData.price}
              onChange={handleChange}
              className="input-field"
              min="0"
              step="1000"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn || ""}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Published Year</label>
            <input
              type="number"
              name="publishedYear"
              value={formData.publishedYear || ""}
              onChange={handleChange}
              className="input-field"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Audience</label>
            <input
              type="text"
              name="audience"
              value={formData.audience || ""}
              onChange={handleChange}
              className="input-field"
              placeholder="Beginners, Advanced, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Translation Source
            </label>
            <input
              type="text"
              name="translationSource"
              value={formData.translationSource || ""}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Tsinghua University, China"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Original Title
            </label>
            <input
              type="text"
              name="originalTitle"
              value={formData.originalTitle || ""}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Featured</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Active</span>
          </label>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Updating...
            </>
          ) : (
            "Update Book"
          )}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/books")}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
