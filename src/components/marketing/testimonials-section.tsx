import { Quote } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Reveal } from "@/components/shared/reveal";
import { Card, CardContent } from "@/components/ui/card";
import { testimonials } from "@/lib/mock/landing";

export function TestimonialsSection() {
  return (
    <section className="bg-secondary/30 border-y py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ils sauvent des vies avec Bitcoin Blood
          </h2>
          <p className="text-muted-foreground text-lg">
            Donneurs, soignants et organisateurs racontent l'impact sur le
            terrain.
          </p>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-3">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={index * 80}>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col gap-6 p-6">
                  <Quote className="text-primary size-6" />
                  <p className="flex-1 text-pretty">{item.quote}</p>
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                      {item.initials}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {item.role}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
