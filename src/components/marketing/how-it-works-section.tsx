import { Container } from "@/components/layout/container";
import { steps } from "@/components/marketing/content";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/shared/reveal";

export function HowItWorksSection() {
  return (
    <section id="fonctionnement" className="bg-secondary/30 border-y py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Fonctionnement"
          title="Donner devient simple"
          description="Trois étapes suffisent pour passer de l'inscription au don qui sauve."
        />

        <ol className="relative grid gap-8 md:grid-cols-3">
          <span
            aria-hidden
            className="from-primary/40 via-primary/20 absolute top-6 left-0 hidden h-px w-full bg-linear-to-r to-transparent md:block"
          />
          {steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 120}
              direction="left"
            >
              <div className="flex flex-col gap-4">
                <span className="bg-primary text-primary-foreground shadow-primary/30 ring-background relative flex size-12 items-center justify-center rounded-full text-lg font-semibold shadow-lg ring-4">
                  {index + 1}
                </span>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
