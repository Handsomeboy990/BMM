import Image from "next/image";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Logo de la marque (Bitcoin Blood). Le wordmark a un texte foncé sur fond
 * transparent : on le pose donc sur une pastille blanche arrondie pour rester
 * parfaitement lisible sur toutes les surfaces (clair ou sombre, tout thème).
 * `bare` retire la pastille quand le fond est déjà clair et fixe.
 */
export function BrandLogo({
  className,
  bare = false,
  priority = false,
}: {
  className?: string;
  bare?: boolean;
  priority?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center",
        !bare && "rounded-lg bg-white px-2.5 py-1.5 shadow-sm",
      )}
    >
      <Image
        src="/logo_bmm.png"
        alt={siteConfig.name}
        width={821}
        height={304}
        priority={priority}
        className={cn("h-7 w-auto object-contain", className)}
      />
    </span>
  );
}
