"use client";

import type { ComponentProps, ElementType } from "react";

import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "scale";

const HIDDEN: Record<Direction, string> = {
  up: "translate-y-10 opacity-0",
  down: "-translate-y-10 opacity-0",
  left: "-translate-x-12 opacity-0",
  right: "translate-x-12 opacity-0",
  scale: "scale-95 opacity-0",
};

type RevealProps = ComponentProps<"div"> & {
  as?: ElementType;
  delay?: number;
  direction?: Direction;
};

/**
 * Révèle son contenu avec une transition directionnelle lorsqu'il entre
 * dans le viewport. Respecte `prefers-reduced-motion`.
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
      style={{ transitionDelay: `${delay}ms`, ...style }}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:scale-100 motion-reduce:transition-none",
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
