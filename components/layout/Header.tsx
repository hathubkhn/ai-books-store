"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import MobileNav from "./MobileNav";
import LanguageSwitcher from "../LanguageSwitcher";
import CustomerAuthNav from "../auth/CustomerAuthNav";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="font-serif text-xl md:text-2xl font-semibold text-foreground hover:text-accent transition-colors">
              {siteConfig.name}
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link href="/books" className="text-foreground-secondary hover:text-foreground transition-colors">
                {t("books")}
              </Link>
              <div className="relative group">
                <button className="text-foreground-secondary hover:text-foreground transition-colors">
                  {t("categories")}
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-surface-light border border-border rounded-sm shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/category/ai-first-steps" className="block px-4 py-3 hover:bg-surface transition-colors">
                    AI First Steps
                  </Link>
                  <Link href="/category/exploring-ai" className="block px-4 py-3 hover:bg-surface transition-colors">
                    Exploring AI
                  </Link>
                  <Link href="/category/advanced-ai-foundations" className="block px-4 py-3 hover:bg-surface transition-colors">
                    Advanced AI Foundations
                  </Link>
                  <Link href="/category/ai-machine-learning" className="block px-4 py-3 hover:bg-surface transition-colors">
                    AI & Machine Learning
                  </Link>
                  <Link href="/category/computer-vision" className="block px-4 py-3 hover:bg-surface transition-colors">
                    Computer Vision
                  </Link>
                  <Link href="/category/algorithms-programming" className="block px-4 py-3 hover:bg-surface transition-colors">
                    Algorithms & Programming
                  </Link>
                </div>
              </div>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />
              <Link href="/search" className="text-foreground-secondary hover:text-foreground transition-colors">
                <Search className="w-5 h-5" />
              </Link>
              <CustomerAuthNav />
              <Link href="/books" className="btn-primary">
                {t("orderBooks")}
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-3">
              <LanguageSwitcher />
              <Link href="/search" className="text-foreground-secondary hover:text-foreground transition-colors">
                <Search className="w-5 h-5" />
              </Link>
              <CustomerAuthNav />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-foreground-secondary hover:text-foreground transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
