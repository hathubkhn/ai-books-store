"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { siteConfig } from "@/config/site";
import { BookOpen, LayoutGrid, ShoppingCart, LogOut, BarChart3 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/admin", icon: BarChart3 },
    { name: "Books", href: "/admin/books", icon: BookOpen },
    { name: "Categories", href: "/admin/categories", icon: LayoutGrid },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-surface border-r border-border overflow-y-auto">
        <div className="p-6">
          <Link href="/admin" className="font-serif text-xl font-semibold">
            {siteConfig.name}
          </Link>
          <p className="text-sm text-foreground-secondary mt-1">Admin Panel</p>
        </div>

        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            // For /admin, only match exact path
            // For other routes, match exact path or subpaths
            const isActive = item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-colors ${
                  isActive
                    ? "bg-accent text-white"
                    : "text-foreground-secondary hover:bg-surface-light hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 mt-8">
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-3 px-4 py-3 rounded-sm text-foreground-secondary hover:bg-surface-light hover:text-error transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
