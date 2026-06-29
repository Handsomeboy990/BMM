import { Droplet } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="flex flex-1 items-center">
      <Container className="flex flex-col items-center gap-8 py-24 text-center">
        <span className="text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm">
          <Droplet className="text-primary" />
          Bitcoin Mastermind 2026
        </span>

        <div className="flex max-w-2xl flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {siteConfig.name}
          </h1>
          <p className="text-muted-foreground text-lg">
            {siteConfig.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg">Devenir donneur</Button>
          <Button size="lg" variant="outline">
            En savoir plus
          </Button>
        </div>
      </Container>
    </main>
  );
}
