import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-semibold mb-2">
              {siteConfig.name}
            </h3>
            <p className="text-foreground-secondary text-sm">
              {siteConfig.tagline}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/ai-first-steps" className="text-foreground-secondary hover:text-accent transition-colors">
                  AI First Steps
                </Link>
              </li>
              <li>
                <Link href="/category/exploring-ai" className="text-foreground-secondary hover:text-accent transition-colors">
                  Exploring AI
                </Link>
              </li>
              <li>
                <Link href="/category/advanced-ai-foundations" className="text-foreground-secondary hover:text-accent transition-colors">
                  Advanced AI Foundations
                </Link>
              </li>
              <li>
                <Link href="/category/ai-machine-learning" className="text-foreground-secondary hover:text-accent transition-colors">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link href="/category/computer-vision" className="text-foreground-secondary hover:text-accent transition-colors">
                  Computer Vision
                </Link>
              </li>
              <li>
                <Link href="/category/algorithms-programming" className="text-foreground-secondary hover:text-accent transition-colors">
                  Algorithms & Programming
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Information</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-foreground-secondary hover:text-accent transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground-secondary hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-foreground-secondary hover:text-accent transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-foreground-secondary hover:text-accent transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">Get Updates</h4>
            <p className="text-sm text-foreground-secondary mb-4">
              New releases, supplementary learning materials, and programs for AI learners.
            </p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Email address"
                className="input-field text-sm"
              />
              <button type="submit" className="btn-primary w-full text-sm">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-foreground-secondary">
          <p>© {new Date().getFullYear()} {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
