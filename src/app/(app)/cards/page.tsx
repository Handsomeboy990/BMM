import {
  BadgeCheck,
  Bitcoin,
  Droplet,
  ExternalLink,
  QrCode,
} from "lucide-react";
import type { Metadata } from "next";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { bitcoinProofs, donorCard } from "@/lib/mock/cards";

export const metadata: Metadata = { title: "Carte & preuves" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function CardsPage() {
  return (
    <>
      <PageHeader
        title="Carte donneur & preuves Bitcoin"
        description="Votre carte vérifiable et les ancrages d'intégrité sur la blockchain Bitcoin."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Carte donneur */}
        <div className="space-y-3">
          <div className="from-primary relative overflow-hidden rounded-2xl bg-gradient-to-br to-rose-700 p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2 font-semibold">
                <Droplet className="size-5" />
                {siteConfig.name}
              </div>
              <Badge className="border-white/30 bg-white/15 text-white">
                <BadgeCheck className="size-3.5" />
                Vérifiée
              </Badge>
            </div>

            <div className="mt-10 flex items-end justify-between">
              <div>
                <p className="text-sm text-white/70">Titulaire</p>
                <p className="text-xl font-semibold">{donorCard.holder}</p>
                <p className="mt-2 font-mono text-sm tracking-wider text-white/80">
                  {donorCard.cardId}
                </p>
              </div>
              <div className="text-right">
                <span className="block text-4xl font-bold">
                  {donorCard.group}
                </span>
                <span className="text-sm text-white/70">
                  {donorCard.donations} dons
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-sm text-white/80">
              <span>
                Émise le {dateFmt.format(new Date(donorCard.issuedAt))}
              </span>
              <span>
                Valide jusqu'au {dateFmt.format(new Date(donorCard.validUntil))}
              </span>
            </div>

            <QrCode className="absolute -right-6 -bottom-6 size-32 text-white/10" />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <QrCode className="size-4" />
              Afficher le QR
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <a href={donorCard.verifyUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" />
                Page de vérification
              </a>
            </Button>
          </div>
        </div>

        {/* Preuves Bitcoin */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Preuves d'intégrité Bitcoin</CardTitle>
            <Bitcoin className="size-5 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {bitcoinProofs.map((proof) => (
              <div key={proof.id} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{proof.label}</p>
                  {proof.confirmed ? (
                    <Badge variant="success">Confirmée</Badge>
                  ) : (
                    <Badge variant="warning">En attente</Badge>
                  )}
                </div>
                <p className="text-muted-foreground truncate font-mono text-xs">
                  {proof.txid}
                </p>
                <div className="text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  <span>Bloc {proof.block.toLocaleString("fr-FR")}</span>
                  <span>
                    {proof.records.toLocaleString("fr-FR")} dons ancrés
                  </span>
                  <span>{dateFmt.format(new Date(proof.anchoredAt))}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
