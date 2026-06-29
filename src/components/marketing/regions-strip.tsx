import { MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";
import { partnerRegions } from "@/lib/mock/landing";

export function RegionsStrip() {
  return (
    <section className="bg-secondary/30 border-b py-8">
      <Container className="flex flex-col items-center gap-5">
        <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Déployé progressivement à travers le continent
        </span>
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {partnerRegions.map((region) => (
            <li
              key={region}
              className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium transition-colors"
            >
              <MapPin className="text-primary size-3.5" />
              {region}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
