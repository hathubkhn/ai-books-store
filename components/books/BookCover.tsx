import Image from "next/image";

interface BookCoverProps {
  src: string;
  alt: string;
  className?: string;
}

export default function BookCover({ src, alt, className = "" }: BookCoverProps) {
  return (
    <div className={`relative aspect-[3/4] overflow-hidden rounded-sm ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        unoptimized
      />
    </div>
  );
}
