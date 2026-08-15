import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function EarlyBuyerBanner() {
  return (
    <div className="bg-accent-soft border border-accent/20 rounded-sm">
      <div className="container-custom py-8 md:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="font-serif text-2xl md:text-3xl font-semibold mb-2">
            First {siteConfig.earlyBuyerLimit} Readers Per Book
          </h3>
          <p className="text-foreground-secondary mb-6">
            Get {siteConfig.earlyBuyerDiscount}% off each book as one of the first 50 buyers.
          </p>
          
          <p className="text-sm text-foreground-secondary mb-6">
            Each book has its own promotion! Be among the first 50 customers to order any book and receive 10% off that book.
          </p>
          
          <Link href="/books" className="btn-primary inline-block">
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
