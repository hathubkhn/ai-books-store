import { formatVND } from "@/lib/currency";

interface BookPriceProps {
  price: number;
  className?: string;
}

export default function BookPrice({ price, className = "" }: BookPriceProps) {
  return (
    <div className={`font-semibold text-accent ${className}`}>
      {formatVND(price)}
    </div>
  );
}
