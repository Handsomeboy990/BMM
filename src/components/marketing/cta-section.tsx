import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section id="impact" className="py-24">
      <Container>
        <Reveal className="bg-primary text-primary-foreground relative overflow-hidden rounded-2xl border px-8 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,white/15%,transparent)]"
          />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              Rejoignez le réseau qui transforme la générosité en vies sauvées
            </h2>
            <p className="text-primary-foreground/80 max-w-xl text-pretty">
              Inscrivez-vous comme donneur ou mobilisez votre communauté pour la
              prochaine campagne.
            </p>
            <Button size="lg" variant="secondary">
              Devenir donneur
              <ArrowRight />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
