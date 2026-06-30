import { Droplet } from "lucide-react";
import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { DonorRegistrationForm } from "@/components/donate/donor-registration-form";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Devenir donneur",
  description:
    "Inscrivez-vous comme donneur de sang volontaire. Profil signé et ancré sur Bitcoin.",
};

export default function DonatePage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="space-y-4 text-center">
          <Badge variant="primary" className="mx-auto">
            <Droplet className="size-3.5" />
            Réseau panafricain du don
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Devenez donneur, sauvez des vies
          </h1>
          <p className="text-muted-foreground mx-auto max-w-lg text-balance">
            Quelques minutes pour rejoindre le réseau. Vous serez alerté
            uniquement en cas de besoin compatible près de chez vous.
          </p>
        </div>

        <DonorRegistrationForm />
      </div>
    </Container>
  );
}
