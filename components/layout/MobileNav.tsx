"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { t } = useLanguage();
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <nav className="fixed top-16 md:top-20 right-0 bottom-0 w-full max-w-sm bg-surface-light border-l border-border overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <Link
              href="/books"
              className="block text-lg font-medium text-foreground hover:text-accent transition-colors"
              onClick={onClose}
            >
              {t("allBooks")}
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider mb-3">
              {t("categories")}
            </h3>
            <div className="space-y-3">
              <Link
                href="/category/ai-first-steps"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={onClose}
              >
                AI First Steps
              </Link>
              <Link
                href="/category/exploring-ai"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={onClose}
              >
                Exploring AI
              </Link>
              <Link
                href="/category/advanced-ai-foundations"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={onClose}
              >
                Advanced AI Foundations
              </Link>
              <Link
                href="/category/ai-machine-learning"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={onClose}
              >
                AI & Machine Learning
              </Link>
              <Link
                href="/category/computer-vision"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={onClose}
              >
                Computer Vision
              </Link>
              <Link
                href="/category/algorithms-programming"
                className="block text-foreground hover:text-accent transition-colors"
                onClick={onClose}
              >
                Algorithms & Programming
              </Link>
            </div>
          </div>

          <div className="pt-6 border-t border-border">
            <Link href="/books" className="btn-primary w-full text-center block" onClick={onClose}>
              {t("orderBooks")}
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
