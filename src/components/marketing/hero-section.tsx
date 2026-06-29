import { ArrowRight, Droplet } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { stats } from "@/components/marketing/content";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,var(--color-primary)/12%,transparent)]"
      />
      <Container className="flex flex-col items-center gap-8 py-24 text-center sm:py-32">
        <Reveal>
          <Badge variant="primary">
            <Droplet className="size-3.5" />
            Plateforme panafricaine de don de sang
          </Badge>
        </Reveal>

        <Reveal delay={80} className="max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Chaque goutte compte. Connectons les donneurs à ceux qui en ont
            besoin.
          </h1>
        </Reveal>

        <Reveal delay={160} className="max-w-2xl">
          <p className="text-muted-foreground text-lg text-pretty">
            Bitcoin Blood enregistre les donneurs volontaires, retrouve des
            profils compatibles en quelques secondes et déclenche des alertes
            ciblées en cas d'urgence.
          </p>
        </Reveal>

        <Reveal
          delay={240}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button size="lg">
            Devenir donneur
            <ArrowRight />
          </Button>
          <Button size="lg" variant="outline">
            Découvrir le fonctionnement
          </Button>
        </Reveal>

        <Reveal
          delay={320}
          className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-primary text-3xl font-semibold">
                {stat.value}
              </span>
              <span className="text-muted-foreground text-sm">
                {stat.label}
              </span>
            </div>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
