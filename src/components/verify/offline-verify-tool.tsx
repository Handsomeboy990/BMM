"use client";

import { CheckCircle2, ShieldCheck, WifiOff, XCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { verifyDonorSignature } from "@/lib/bitcoin/donor-identity";

type Result = { ok: boolean } | null;

/**
 * Vérification BIP-322 hors-ligne — « Identité Sanguine Souveraine ».
 * Tout se passe dans le navigateur : une clinique peut confirmer une
 * attestation signée même sans connexion internet.
 */
export function OfflineVerifyTool({
  defaultAddress = "",
  defaultMessage = "",
}: {
  defaultAddress?: string;
  defaultMessage?: string;
}) {
  const [address, setAddress] = useState(defaultAddress);
  const [message, setMessage] = useState(defaultMessage);
  const [signature, setSignature] = useState("");
  const [result, setResult] = useState<Result>(null);

  function onVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult({ ok: verifyDonorSignature(address, message, signature) });
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <WifiOff className="text-accent size-5" />
          Vérification hors-ligne
        </CardTitle>
        <span className="bg-accent/15 text-accent rounded-full px-2 py-0.5 text-[11px] font-medium">
          Sans internet
        </span>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <p className="text-muted-foreground text-sm">
          Confirmez une attestation signée (groupe sanguin, empreinte de profil)
          directement sur l'appareil, sans aucun appel réseau — idéal pour les
          cliniques rurales en cas de coupure.
        </p>

        <form onSubmit={onVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ov-address">Adresse Bitcoin du signataire</Label>
            <Input
              id="ov-address"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setResult(null);
              }}
              placeholder="bc1q…"
              className="font-mono text-xs"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ov-message">Attestation signée</Label>
            <Input
              id="ov-message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setResult(null);
              }}
              placeholder="Empreinte de profil ou message signé"
              className="font-mono text-xs"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ov-signature">Signature BIP-322</Label>
            <Textarea
              id="ov-signature"
              value={signature}
              onChange={(e) => {
                setSignature(e.target.value);
                setResult(null);
              }}
              placeholder="Signature base64…"
              rows={3}
              className="font-mono text-xs"
              required
            />
          </div>

          {result ? (
            result.ok ? (
              <p className="flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                Signature valide — attestation authentique.
              </p>
            ) : (
              <p className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                <XCircle className="size-4 shrink-0" />
                Signature invalide — attestation non vérifiée.
              </p>
            )
          ) : null}

          <Button type="submit" className="w-full">
            <ShieldCheck className="size-4" />
            Vérifier localement
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
