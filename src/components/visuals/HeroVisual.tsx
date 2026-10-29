import Image from "next/image";
import { cn } from "@/lib/utils";

/** Photograph filling the hero visual column. */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[1.5rem] shadow-[0_24px_50px_-28px_rgb(16_24_32/0.4)]",
        "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[540px]",
        className,
      )}
    >
      <Image
        src="/images/hero/workspace.jpg"
        alt="Software engineers working at laptops in a bright office"
        fill
        // LCP image at every viewport: preload it. Served through the Next.js optimizer (resized + AVIF/WebP).
        preload
        sizes="(min-width: 1024px) 46vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
