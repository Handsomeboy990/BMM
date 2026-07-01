import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  showText?: boolean;
};

export function Logo({ className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      <div className="relative flex shrink-0 items-center justify-center">
        <svg
          className="size-9 drop-shadow-[0_2px_8px_rgba(239,68,68,0.25)] filter transition-transform duration-300 hover:scale-105"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="dropletGrad"
              x1="32"
              y1="4"
              x2="32"
              y2="60"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#ff4b4b" />
              <stop offset="60%" stopColor="#e11d48" />
              <stop offset="100%" stopColor="#be123c" />
            </linearGradient>
          </defs>
          {/* Main Droplet */}
          <path
            d="M32 4C32 4 8 32 8 48C8 61.25 18.75 72 32 72C45.25 72 56 61.25 56 48C56 32 32 4 32 4Z"
            fill="url(#dropletGrad)"
          />
          {/* Crescent highlight */}
          <path
            d="M15 50C15 57 20 62 26 63"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Bitcoin symbol */}
          <text
            x="32.5"
            y="55.5"
            fontFamily="system-ui, sans-serif"
            fontWeight="800"
            fontSize="23"
            fill="white"
            textAnchor="middle"
            transform="rotate(-12 32.5 48)"
          >
            ₿
          </text>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-baseline text-[20px] font-semibold tracking-tight">
            <span className="text-foreground font-sans transition-colors duration-300">
              Bitcoin
            </span>
            <span className="font-sans font-bold text-red-500">Blood</span>
          </div>
          <span className="text-muted-foreground/90 mt-1 text-[7.5px] font-semibold tracking-[0.22em] uppercase">
            Connect <span className="text-red-500">•</span> Donate{" "}
            <span className="text-red-500">•</span> Save Lives
          </span>
        </div>
      )}
    </div>
  );
}
