import { cn } from "@/lib/utils";

type LogoVariant = "full" | "compact" | "stacked" | "mark";

type LogoProps = {
  className?: string;
  /**
   * `full` marque + nom + signature, `compact` marque + nom,
   * `stacked` version verticale, `mark` la goutte seule.
   */
  variant?: LogoVariant;
  /** Rend le nom en blanc, pour les fonds sombres permanents. */
  onDark?: boolean;
};

/**
 * Marque HEMORA: une goutte de sang qui abrite un donneur les bras levés,
 * portant un cœur. Dessinée en SVG plutôt qu'en image pour rester nette à
 * toutes les tailles, suivre le thème et ne rien coûter au chargement.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      focusable="false"
      className={cn("size-9", className)}
    >
      <defs>
        <linearGradient id="hemora-drop" x1="32" y1="2" x2="32" y2="62">
          <stop offset="0%" stopColor="#E23744" />
          <stop offset="55%" stopColor="#C0202C" />
          <stop offset="100%" stopColor="#8E1520" />
        </linearGradient>
      </defs>

      {/* Goutte */}
      <path
        d="M32 2.5c0 0 24 24.6 24 39.1C56 53.4 45.3 61.5 32 61.5S8 53.4 8 41.6C8 27.1 32 2.5 32 2.5Z"
        fill="url(#hemora-drop)"
      />

      {/* Donneur: tête, bras levés, corps. Découpé dans la goutte. */}
      <g fill="#fff">
        <circle cx="32" cy="27" r="6" />
        <path d="M18.4 27.8a2.9 2.9 0 0 1 4.6-3.4c2.4 3.2 5.4 5.3 9 6.2v5.6c-5.4-1-10-4-13.6-8.4Z" />
        <path d="M45.6 27.8a2.9 2.9 0 0 0-4.6-3.4c-2.4 3.2-5.4 5.3-9 6.2v5.6c5.4-1 10-4 13.6-8.4Z" />
        <path d="M32 34.6c5.2 0 9.4 3.9 9.4 8.7 0 6-5.4 10.8-9.4 13.5-4-2.7-9.4-7.5-9.4-13.5 0-4.8 4.2-8.7 9.4-8.7Z" />
      </g>

      {/* Cœur porté par le donneur */}
      <path
        d="M32 52.4c-3.4-2.4-6-5-6-7.7 0-1.9 1.5-3.3 3.3-3.3 1.1 0 2.1.5 2.7 1.4.6-.9 1.6-1.4 2.7-1.4 1.8 0 3.3 1.4 3.3 3.3 0 2.7-2.6 5.3-6 7.7Z"
        fill="#C0202C"
      />
    </svg>
  );
}

const TAGLINE = "Connecter les sauveurs, protéger les vies";

export function Logo({ className, variant = "compact", onDark }: LogoProps) {
  if (variant === "mark") {
    return <BrandMark className={className} />;
  }

  if (variant === "stacked") {
    return (
      <span
        className={cn(
          "flex flex-col items-center gap-3 text-center select-none",
          className,
        )}
      >
        <BrandMark className="size-16" />
        <span className="flex flex-col items-center gap-1.5">
          <span
            className={cn(
              "font-display text-2xl leading-none font-extrabold tracking-[0.14em]",
              onDark ? "text-white" : "text-secondary dark:text-foreground",
            )}
          >
            HEMORA
          </span>
          <span
            className={cn(
              "text-[0.6rem] leading-tight font-semibold tracking-[0.18em] uppercase",
              onDark ? "text-white/70" : "text-primary/80",
            )}
          >
            {TAGLINE}
          </span>
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn("flex items-center gap-2.5 select-none", className)}
      aria-label="HEMORA"
    >
      <BrandMark className="size-8 shrink-0" />
      <span className="flex flex-col justify-center gap-0.5 leading-none">
        <span
          className={cn(
            "font-display text-xl leading-none font-extrabold tracking-[0.12em]",
            onDark ? "text-white" : "text-secondary dark:text-foreground",
          )}
        >
          HEMORA
        </span>
        {variant === "full" && (
          <span
            className={cn(
              "text-[0.5rem] leading-none font-semibold tracking-[0.16em] uppercase",
              onDark ? "text-white/65" : "text-muted-foreground",
            )}
          >
            {TAGLINE}
          </span>
        )}
      </span>
    </span>
  );
}
