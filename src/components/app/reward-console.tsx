"use client";

import { AlertCircle, Bitcoin, CheckCircle2, Search, Zap } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRewardDonor, useVerifyDonor } from "@/lib/api/hooks";

export function RewardConsole() {
  const [query, setQuery] = useState("");
  const [donorId, setDonorId] = useState("");
  const [sent, setSent] = useState(false);
  const [rewardError, setRewardError] = useState<string | null>(null);

  const verify = useVerifyDonor(donorId, donorId.length > 0);
  const reward = useRewardDonor();

  async function onReward(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRewardError(null);
    setSent(false);
    const form = new FormData(event.currentTarget);
    try {
      await reward.mutateAsync({
        id: donorId,
        bolt11Invoice: String(form.get("bolt11Invoice")),
        satsAmount: Number(form.get("satsAmount")) || undefined,
      });
      setSent(true);
    } catch (err) {
      setRewardError(
        err instanceof Error ? err.message : "Le paiement a échoué.",
      );
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Recherche du donneur */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label htmlFor="donorId">Identifiant du donneur</Label>
            <div className="flex gap-2">
              <Input
                id="donorId"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="UUID du donneur"
                className="font-mono"
              />
              <Button
                type="button"
                onClick={() => setDonorId(query.trim())}
                disabled={!query.trim()}
              >
                <Search className="size-4" />
                Vérifier
              </Button>
            </div>
            <p className="text-muted-foreground text-xs">
              Saisissez l'identifiant figurant sur la carte du donneur après un
              don validé physiquement.
            </p>
          </div>

          {donorId ? (
            verify.isLoading ? (
              <p className="text-muted-foreground text-sm">Vérification…</p>
            ) : verify.isError || !verify.data ? (
              <p className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <AlertCircle className="size-4" />
                Donneur introuvable.
              </p>
            ) : (
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                  {verify.data.donor.bloodType}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono text-xs">
                    {verify.data.donor.id}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Adresse {verify.data.donor.bitcoinAddress.slice(0, 12)}…
                  </p>
                </div>
                {verify.data.verification.isTimestampVerified ? (
                  <Badge variant="success">
                    <Bitcoin className="size-3.5" />
                    Vérifié
                  </Badge>
                ) : (
                  <Badge variant="warning">Non ancré</Badge>
                )}
              </div>
            )
          ) : null}
        </CardContent>
      </Card>

      {/* Récompense Lightning */}
      <Card>
        <CardContent className="p-6">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 className="size-12 text-emerald-500" />
              <div className="space-y-1">
                <h2 className="font-semibold">Récompense envoyée</h2>
                <p className="text-muted-foreground text-sm">
                  Le paiement Lightning a été transmis au donneur.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false);
                  setDonorId("");
                  setQuery("");
                }}
              >
                Récompenser un autre donneur
              </Button>
            </div>
          ) : (
            <form onSubmit={onReward} className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="size-5 text-amber-500" />
                <h2 className="font-semibold">Récompense Lightning</h2>
              </div>

              {rewardError ? (
                <p className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <AlertCircle className="size-4 shrink-0" />
                  {rewardError}
                </p>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="bolt11Invoice">Facture BOLT11 du donneur</Label>
                <Input
                  id="bolt11Invoice"
                  name="bolt11Invoice"
                  required
                  minLength={10}
                  placeholder="lnbc…"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="satsAmount">Montant (sats)</Label>
                <Input
                  id="satsAmount"
                  name="satsAmount"
                  type="number"
                  min={1}
                  defaultValue={1000}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!verify.data || reward.isPending}
              >
                <Zap className="size-4" />
                {reward.isPending ? "Envoi…" : "Envoyer la récompense"}
              </Button>
              {!verify.data ? (
                <p className="text-muted-foreground text-center text-xs">
                  Vérifiez d'abord un donneur pour activer la récompense.
                </p>
              ) : null}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
