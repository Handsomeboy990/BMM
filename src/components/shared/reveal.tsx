"use client";

import type { ComponentProps, ElementType } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type RevealProps = ComponentProps<"div"> & {
  as?: ElementType;
  delay?: number;
};

/**
 * Révèle son contenu par une transition douce lorsqu'il entre dans
 * le viewport. Respecte `prefers-reduced-motion` via les utilitaires
 * Tailwind appliqués en aval.
 */
export function Reveal({
  as,
  delay = 0,
  className,
  style,
  children,
  ...props
}: RevealProps) {
  const Component = (as ?? "div") as ElementType;
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Component
      ref={ref}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      className={cn(
        "translate-y-6 opacity-0 transition-all duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:transition-none",
        inView && "translate-y-0 opacity-100",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
