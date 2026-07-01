import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { DonationForm } from "@/components/donate/donation-form";

export const metadata: Metadata = {
  title: "Soutenir la plateforme",
  description:
    "Faites un don en Bitcoin Lightning pour soutenir les campagnes, le developpement ou le fonctionnement de Bitcoin Blood.",
};

export default function SupportPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Soutenez Bitcoin Blood
          </h1>
          <p className="text-muted-foreground">
            Votre don en sats finance directement le reseau : campagnes de don
            de sang, developpement du produit, fonctionnement et fonds
            d&apos;urgence. Paiement instantane via Lightning, sans
            intermediaire.
          </p>
        </div>
        <DonationForm />
      </div>
    </Container>
  );
}
