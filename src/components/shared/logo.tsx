"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "horizontal" | "vertical" | "icon";
  className?: string;
  height?: number | string;
}

export function Logo({ variant = "horizontal", className, height }: LogoProps) {
  if (variant === "icon") {
    return (
      <span
        className={cn(
          "border-border/40 relative flex shrink-0 items-center justify-center overflow-hidden rounded border bg-white p-0.5 shadow-sm",
          className,
        )}
        style={{
          height: height || "1.75rem",
          width: height || "1.75rem",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-vertical.png"
          alt="HEMORA Icon"
          className="h-full w-full object-contain"
        />
      </span>
    );
  }

  if (variant === "vertical") {
    return (
      <div
        className={cn(
          "border-border/40 flex flex-col items-center justify-center rounded-lg border bg-white p-4 shadow-sm",
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-vertical.png"
          alt="HEMORA"
          className="w-auto object-contain"
          style={{ height: height || "12rem" }}
        />
      </div>
    );
  }

  // Horizontal logo (default)
  return (
    <div
      className={cn(
        "border-border/40 flex items-center justify-center rounded-md border bg-white px-2.5 py-1.5 shadow-sm",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-horizontal.png"
        alt="HEMORA"
        className="w-auto object-contain"
        style={{ height: height || "2rem" }}
      />
    </div>
  );
}
