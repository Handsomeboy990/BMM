import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { VerifyPanel } from "@/components/verify/verify-panel";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Vérification d'un donneur",
  description: "Vérifiez l'intégrité d'un profil donneur ancré sur Bitcoin.",
};

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="space-y-3 text-center">
          <Badge variant="primary" className="mx-auto">
            <ShieldCheck className="size-3.5" />
            Vérification publique
          </Badge>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Preuve d'intégrité du donneur
          </h1>
          <p className="text-muted-foreground text-sm">
            Statut d'ancrage du profil sur la blockchain Bitcoin via
            OpenTimestamps.
          </p>
        </div>

        <VerifyPanel id={id} />
      </div>
    </Container>
  );
}
