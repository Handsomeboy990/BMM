"use client";

import type { ComponentProps, ElementType } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "scale";

// Décalages volontairement discrets, dans l'esprit de Spaceship :
// l'élément glisse de quelques pixels seulement et se fond en place.
const HIDDEN: Record<Direction, string> = {
  up: "translate-y-3 opacity-0",
  down: "-translate-y-3 opacity-0",
  left: "-translate-x-3 opacity-0",
  right: "translate-x-3 opacity-0",
  scale: "scale-[0.98] opacity-0",
};

type RevealProps = ComponentProps<"div"> & {
  as?: ElementType;
  delay?: number;
  direction?: Direction;
};

/**
 * Révèle son contenu avec une transition directionnelle lorsqu'il entre dans
 * le viewport. Respecte `prefers-reduced-motion`.
 *
 * L'attribut `data-reveal` sert de point d'accroche au repli sans JavaScript
 * déclaré dans `globals.css`: sans lui, un navigateur qui n'exécute pas le
 * script laisserait ce contenu invisible pour toujours, puisque l'état initial
 * est `opacity-0`.
 */
export function Reveal({
  as,
  delay = 0,
  direction = "up",
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
      data-reveal=""
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: "cubic-bezier(0, 0, 0.35, 1)",
        ...style,
      }}
      className={cn(
        "transition-all duration-600 will-change-transform motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-none",
        inView
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : HIDDEN[direction],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
