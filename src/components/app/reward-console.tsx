"use client";

import {
  AlertCircle,
  Award,
  Bitcoin,
  CheckCircle2,
  Search,
  Smartphone,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import { useRewardDonor, useVerifyDonor } from "@/lib/api/hooks";
import {
  MOBILE_MONEY_OPERATORS,
  type RewardMode,
  loadRewardPreference,
} from "@/lib/reward-preference";
import { cn } from "@/lib/utils";

type PayoutMode = RewardMode | "points";

export function RewardConsole() {
  const [query, setQuery] = useState("");
  const [donorId, setDonorId] = useState("");
  const [sent, setSent] = useState(false);
  const [payoutModeOverride, setPayoutModeOverride] =
    useState<PayoutMode | null>(null);
  const [rewardError, setRewardError] = useState<string | null>(null);

  const verify = useVerifyDonor(donorId, donorId.length > 0);
  const reward = useRewardDonor();

  // Canal de versement : choix explicite de l'utilisateur, sinon préférence
  // exprimée par le donneur à l'inscription (même navigateur), sinon Lightning.
  const preference = donorId ? loadRewardPreference(donorId) : null;
  const payoutMode: PayoutMode =
    payoutModeOverride ?? preference?.mode ?? "lightning";
  const setPayoutMode = setPayoutModeOverride;

  // Versement Lightning (BOLT11) via Breez côté serveur.
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

  // Versement Mobile Money : cash-out des satoshis via Izichange (endpoint réel
  // POST /verify/[id] avec momoNumber). « La Récompense Invisible ».
  async function onMomoReward(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRewardError(null);
    setSent(false);
    const form = new FormData(event.currentTarget);
    try {
      await reward.mutateAsync({
        id: donorId,
        momoNumber: String(form.get("momoPhone")),
        satsAmount: Number(form.get("momoSats")) || undefined,
      });
      setSent(true);
    } catch (err) {
      setRewardError(
        err instanceof Error ? err.message : "Le dépôt Mobile Money a échoué.",
      );
    }
  }

  // Attribution de points de fidélité (ancrés OTS) au lieu d'un versement.
  async function onPointsReward(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRewardError(null);
    setSent(false);
    const form = new FormData(event.currentTarget);
    try {
      await reward.mutateAsync({
        id: donorId,
        awardPoints: true,
        satsAmount: Number(form.get("pointsAmount")) || undefined,
      });
      setSent(true);
    } catch (err) {
      setRewardError(
        err instanceof Error ? err.message : "L'attribution a échoué.",
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
                <h2 className="font-semibold">
                  {payoutMode === "points"
                    ? "Points attribués"
                    : "Récompense envoyée"}
                </h2>
                <p className="text-muted-foreground text-sm">
                  {payoutMode === "mobile-money"
                    ? "Le dépôt Mobile Money a été initié via Izichange. Le donneur reçoit un SMS de confirmation."
                    : payoutMode === "points"
                      ? "Les points de fidélité ont été attribués et ancrés sur Bitcoin (OTS)."
                      : "Le paiement Lightning a été transmis au donneur."}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSent(false);
                  setDonorId("");
                  setQuery("");
                  setPayoutModeOverride(null);
                }}
              >
                Récompenser un autre donneur
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="size-5 text-amber-500" />
                <h2 className="font-semibold">Verser la récompense</h2>
              </div>

              {/* Canal de versement — « la Récompense Invisible ». */}
              <div className="bg-muted/50 grid grid-cols-3 gap-1 rounded-lg p-1">
                <ModeTab
                  active={payoutMode === "mobile-money"}
                  onClick={() => setPayoutMode("mobile-money")}
                  icon={<Smartphone className="size-4" />}
                  label="MoMo"
                />
                <ModeTab
                  active={payoutMode === "lightning"}
                  onClick={() => setPayoutMode("lightning")}
                  icon={<Zap className="size-4" />}
                  label="Lightning"
                />
                <ModeTab
                  active={payoutMode === "points"}
                  onClick={() => setPayoutMode("points")}
                  icon={<Award className="size-4" />}
                  label="Points"
                />
              </div>

              {rewardError ? (
                <p className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                  <AlertCircle className="size-4 shrink-0" />
                  {rewardError}
                </p>
              ) : null}

              {payoutMode === "lightning" ? (
                <form onSubmit={onReward} className="animate-rise-in space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bolt11Invoice">
                      Facture BOLT11 du donneur
                    </Label>
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
                </form>
              ) : payoutMode === "mobile-money" ? (
                <form
                  onSubmit={onMomoReward}
                  className="animate-rise-in space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="momoOperator">Opérateur</Label>
                      <Select
                        id="momoOperator"
                        name="momoOperator"
                        defaultValue={preference?.operator ?? "mtn"}
                      >
                        {MOBILE_MONEY_OPERATORS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="momoPhone">Numéro</Label>
                      <Input
                        id="momoPhone"
                        name="momoPhone"
                        type="tel"
                        required
                        defaultValue={preference?.phone ?? ""}
                        placeholder="+229 …"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="momoSats">Montant (sats)</Label>
                    <Input
                      id="momoSats"
                      name="momoSats"
                      type="number"
                      min={1}
                      defaultValue={1000}
                    />
                  </div>
                  <p className="text-muted-foreground flex items-start gap-2 text-xs">
                    <Smartphone className="mt-0.5 size-3.5 shrink-0" />
                    Les satoshis sont convertis à la volée via Izichange et
                    déposés sur le Mobile Money du donneur. Bitcoin reste
                    invisible pour lui.
                  </p>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!verify.data || reward.isPending}
                  >
                    <Smartphone className="size-4" />
                    {reward.isPending ? "Envoi…" : "Déposer sur Mobile Money"}
                  </Button>
                </form>
              ) : (
                <form
                  onSubmit={onPointsReward}
                  className="animate-rise-in space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="pointsAmount">Points à attribuer</Label>
                    <Input
                      id="pointsAmount"
                      name="pointsAmount"
                      type="number"
                      min={1}
                      defaultValue={1000}
                    />
                  </div>
                  <p className="text-muted-foreground flex items-start gap-2 text-xs">
                    <Award className="mt-0.5 size-3.5 shrink-0" />
                    Idéal quand la structure n'a pas de budget immédiat : les
                    points de fidélité sont ancrés sur Bitcoin (OTS) et
                    convertibles plus tard en récompense.
                  </p>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!verify.data || reward.isPending}
                  >
                    <Award className="size-4" />
                    {reward.isPending ? "Attribution…" : "Attribuer les points"}
                  </Button>
                </form>
              )}

              {!verify.data ? (
                <p className="text-muted-foreground text-center text-xs">
                  Vérifiez d'abord un donneur pour activer la récompense.
                </p>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
