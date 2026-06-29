import { ArrowRight, Droplet } from "lucide-react";

import { Container } from "@/components/layout/container";
import { HeroIllustration } from "@/components/marketing/hero-illustration";
import { StatCounter } from "@/components/marketing/stat-counter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { landingStats } from "@/lib/mock/landing";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="animate-pulse-glow bg-primary/15 pointer-events-none absolute -top-40 left-1/2 -z-10 h-140 w-140 -translate-x-1/2 rounded-full blur-3xl"
      />
      <Container className="grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
        <div className="flex flex-col items-start gap-6">
          <Badge variant="primary" className="animate-rise-in">
            <Droplet className="size-3.5" />
            Plateforme panafricaine de don de sang
          </Badge>

          <h1
            className="animate-rise-in text-4xl font-semibold tracking-tight text-balance sm:text-5xl xl:text-6xl"
            style={{ animationDelay: "80ms" }}
          >
            Chaque goutte compte. Connectons les donneurs à ceux qui en ont
            besoin.
          </h1>

          <p
            className="animate-rise-in text-muted-foreground max-w-xl text-lg text-pretty"
            style={{ animationDelay: "160ms" }}
          >
            Bitcoin Blood enregistre les donneurs volontaires, retrouve des
            profils compatibles en quelques secondes et déclenche des alertes
            ciblées en cas d'urgence.
          </p>

          <div
            className="animate-rise-in flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Button size="lg" className="group">
              Devenir donneur
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button size="lg" variant="outline">
              Découvrir le fonctionnement
            </Button>
          </div>
        </div>

        <div
          className="animate-rise-in relative"
          style={{ animationDelay: "200ms" }}
        >
          <HeroIllustration className="animate-float mx-auto max-w-md" />
        </div>
      </Container>

      <Container className="grid grid-cols-2 gap-8 border-t py-10 lg:grid-cols-4">
        {landingStats.map((stat) => (
          <StatCounter
            key={stat.label}
            value={stat.value}
            suffix={stat.suffix}
            label={stat.label}
          />
        ))}
      </Container>
    </section>
  );
}
