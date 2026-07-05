"use client";

import {
  AlertCircle,
  Camera,
  Check,
  Clock,
  CreditCard,
  Printer,
  Smartphone,
} from "lucide-react";
import { useRef, useState } from "react";

import { DonorCard } from "@/components/donor/donor-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fileToPhotoDataUrl,
  setCardStatus,
  upsertCardRequest,
  useCardRequest,
} from "@/lib/card-request";
import { publicUrl } from "@/lib/url";

type Donor = {
  id: string;
  firstName: string;
  lastName: string;
  bloodType?: string;
  city?: string;
};

export function DonorCardSection({ donor }: { donor: Donor }) {
  const request = useCardRequest(donor.id);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const name = `${donor.firstName} ${donor.lastName}`;
  const photo = request?.photo;
  const status = request?.status ?? "none";
  const verifyUrl = publicUrl(`/verify/${donor.id}`);

  async function onPhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const dataUrl = await fileToPhotoDataUrl(file);
      upsertCardRequest({
        donorId: donor.id,
        donorName: name,
        bloodType: donor.bloodType,
        photo: dataUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo invalide.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function requestCard(format: "physical" | "digital") {
    if (!photo) {
      setError("Ajoutez d'abord votre photo.");
      return;
    }
    setError(null);
    upsertCardRequest({
      donorId: donor.id,
      donorName: name,
      bloodType: donor.bloodType,
      format,
      status: "requested",
      requestedAt: new Date().toISOString(),
    });
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Ma carte de donneur</CardTitle>
        <CreditCard className="text-primary size-5" />
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="print-area flex justify-center">
          <DonorCard
            name={name}
            bloodType={donor.bloodType}
            donorId={donor.id}
            city={donor.city}
            photo={photo}
            verifyUrl={verifyUrl}
          />
        </div>

        {error ? (
          <p className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </p>
        ) : null}

        <div className="no-print space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            <Camera className="size-4" />
            {busy
              ? "Traitement…"
              : photo
                ? "Changer ma photo"
                : "Ajouter ma photo"}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPhoto}
          />

          {status === "none" ? (
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm">
                Demandez votre carte. Un administrateur la validera avant
                émission.
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Button onClick={() => requestCard("digital")}>
                  <Smartphone className="size-4" />
                  Carte numérique
                </Button>
                <Button
                  variant="outline"
                  onClick={() => requestCard("physical")}
                >
                  <CreditCard className="size-4" />
                  Carte physique
                </Button>
              </div>
            </div>
          ) : status === "requested" ? (
            <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
              <Clock className="size-5 shrink-0 text-amber-500" />
              <div>
                <p className="font-medium">Demande en cours de validation</p>
                <p className="text-muted-foreground text-sm">
                  Votre carte{" "}
                  {request?.format === "physical" ? "physique" : "numérique"}{" "}
                  sera disponible dès validation par un administrateur.
                </p>
              </div>
            </div>
          ) : status === "rejected" ? (
            <div className="space-y-2">
              <div className="border-destructive/30 bg-destructive/10 flex items-center gap-3 rounded-lg border p-4">
                <AlertCircle className="text-destructive size-5 shrink-0" />
                <p className="text-sm">
                  Votre demande a été refusée. Vérifiez votre photo et
                  renouvelez la demande.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCardStatus(donor.id, "requested")}
              >
                Renouveler ma demande
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
                <Check className="size-5 shrink-0 text-emerald-500" />
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  {request?.format === "physical"
                    ? "Carte validée : votre centre l'imprimera et vous la remettra."
                    : "Carte validée : elle est disponible ci-dessus."}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.print()}
              >
                <Printer className="size-4" />
                Imprimer / enregistrer en PDF
              </Button>
            </div>
          )}

          {status !== "none" ? (
            <Badge variant="neutral" className="w-full justify-center">
              {request?.format === "physical"
                ? "Carte physique"
                : "Carte numérique"}
            </Badge>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
