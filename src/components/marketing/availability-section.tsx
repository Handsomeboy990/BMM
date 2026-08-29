"use client";

import { Droplet } from "lucide-react";

import { Container } from "@/components/layout/container";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicStats } from "@/lib/api/hooks";
import type { StockStatus } from "@/lib/api/resources";
import { homeSectionIds } from "@/config/navigation";
import { cn } from "@/lib/utils";

const STATUS_THEME: Record<
  StockStatus,
  { label: string; color: string; dot: string; bar: string }
> = {
  critique: {
    label: "Critique",
    color: "text-primary",
    dot: "bg-primary",
    bar: "bg-primary",
  },
  faible: {
    label: "Faible",
    color: "text-amber-500",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
  },
  stable: {
    label: "Stable",
    color: "text-emerald-500",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
};

/**
 * Niveau des réserves déclaré par les structures du réseau. Le pourcentage
 * est relatif au groupe le mieux pourvu: c'est la seule lecture honnête sans
 * objectif national de référence, et la légende le dit.
 */
export function AvailabilitySection() {
  const stats = usePublicStats();

  return (
    <section id={homeSectionIds.reserves} className="relative border-t py-24">
      <Container className="flex flex-col gap-14">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Droplet className="text-primary size-4" />
            <span className="text-primary text-xs font-semibold tracking-wider uppercase">
              Niveaux des réserves
            </span>
          </div>
          <SectionHeading
            title="Disponibilité des groupes sanguins"
            description="Niveaux déclarés par les structures du réseau, rapportés au groupe le mieux pourvu. Un groupe en rouge a besoin de donneurs maintenant."
          />
        </div>

        {stats.isPending ? (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        ) : stats.isError ? (
          <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
            Les niveaux de réserve ne sont pas consultables pour le moment.
          </p>
        ) : stats.data.availability.length === 0 ? (
          <p className="text-muted-foreground rounded-xl border border-dashed p-8 text-center text-sm">
            Aucune structure du réseau n'a encore publié son stock. Les niveaux
            apparaîtront ici dès la première déclaration.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.data.availability.map((item, index) => {
              const theme = STATUS_THEME[item.status];
              return (
                <Reveal key={item.bloodType} delay={index * 40} direction="up">
                  <div className="border-border/40 bg-card hover:border-border flex flex-col gap-3 rounded-xl border p-5 transition-colors duration-200">
                    <div className="flex items-baseline justify-between">
                      <span className="font-display text-2xl font-extrabold tracking-tight">
                        {item.bloodType}
                      </span>
                      <span className="text-muted-foreground text-sm tabular-nums">
                        {item.level}%
                      </span>
                    </div>

                    <div
                      role="meter"
                      aria-valuenow={item.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Réserve du groupe ${item.bloodType}: ${theme.label.toLowerCase()}`}
                      className="bg-muted h-1.5 w-full overflow-hidden rounded-full"
                    >
                      <div
                        className={cn(
                          "h-full rounded-full transition-[width] duration-1000 motion-reduce:transition-none",
                          theme.bar,
                        )}
                        style={{ width: `${item.level}%` }}
                      />
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-1.5">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={cn("size-1.5 rounded-full", theme.dot)}
                        />
                        <span
                          className={cn(
                            "text-[10px] font-semibold tracking-wider uppercase",
                            theme.color,
                          )}
                        >
                          {theme.label}
                        </span>
                      </span>
                      <span className="text-muted-foreground text-[10px] tabular-nums">
                        {item.units} poches
                      </span>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}
