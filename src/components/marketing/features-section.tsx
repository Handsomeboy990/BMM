import { Container } from "@/components/layout/container";
import { features } from "@/components/marketing/content";
import { Reveal } from "@/components/shared/reveal";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function FeaturesSection() {
  return (
    <section id="donneurs" className="py-24">
      <Container className="flex flex-col gap-12">
        <Reveal className="flex max-w-2xl flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tout ce qu'il faut pour mobiliser les donneurs
          </h2>
          <p className="text-muted-foreground text-lg">
            Une plateforme pensée pour la rapidité, la confiance et la
            traçabilité, de l'inscription jusqu'au don.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 70}>
              <Card className="h-full transition-shadow duration-300 hover:shadow-md">
                <CardHeader>
                  <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                    <feature.icon className="size-5" />
                  </span>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
