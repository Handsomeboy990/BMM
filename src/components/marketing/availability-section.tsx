import { Container } from "@/components/layout/container";
import { AvailabilityBar } from "@/components/marketing/availability-bar";
import { Reveal } from "@/components/shared/reveal";
import { Badge } from "@/components/ui/badge";
import { bloodAvailability } from "@/lib/mock/landing";

export function AvailabilitySection() {
  return (
    <section id="campagnes" className="py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-4">
          <Badge variant="neutral">Données simulées en temps réel</Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Visibilité immédiate sur les réserves
          </h2>
          <p className="text-muted-foreground text-lg">
            Suivez les niveaux par groupe sanguin pour anticiper les pénuries et
            déclencher les campagnes au bon moment.
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bloodAvailability.map((item, index) => (
            <Reveal key={item.group} delay={index * 50}>
              <AvailabilityBar {...item} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
