import { Container } from "@/components/layout/container";
import { steps } from "@/components/marketing/content";
import { Reveal } from "@/components/shared/reveal";

export function HowItWorksSection() {
  return (
    <section id="fonctionnement" className="bg-secondary/30 border-y py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Donner devient simple
          </h2>
          <p className="text-muted-foreground text-lg">
            Trois étapes suffisent pour passer de l'inscription au don qui
            sauve.
          </p>
        </Reveal>

        <ol className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.title} delay={index * 90}>
              <div className="flex flex-col gap-4">
                <span className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-full text-lg font-semibold">
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
