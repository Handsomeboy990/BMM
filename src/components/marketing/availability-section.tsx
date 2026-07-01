import { Container } from "@/components/layout/container";
import { AvailabilityBar } from "@/components/marketing/availability-bar";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { bloodAvailability } from "@/lib/mock/landing";

export function AvailabilitySection() {
  return (
    <section id="campagnes" className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="animate-pulse-glow bg-primary/10 pointer-events-none absolute top-1/2 -right-32 -z-10 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl"
      />
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Données simulées en temps réel"
          title="Visibilité immédiate sur les réserves"
          description="Suivez les niveaux par groupe sanguin pour anticiper les pénuries et déclencher les campagnes au bon moment."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bloodAvailability.map((item, index) => (
            <Reveal
              key={item.group}
              delay={(index % 4) * 70}
              direction={index % 2 === 0 ? "up" : "down"}
            >
              <AvailabilityBar {...item} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
