"use client";

import {
  AlertCircle,
  CheckCircle2,
  Copy,
  KeyRound,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useCreateDonor } from "@/lib/api/hooks";
import {
  BLOOD_TYPES,
  type BloodType,
  type DonorRecord,
} from "@/lib/api/resources";
import { createDonorIdentity } from "@/lib/bitcoin/donor-identity";

type Success = { donor: DonorRecord; wif: string };

export function DonorRegistrationForm() {
  const createDonor = useCreateDonor();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [success, setSuccess] = useState<Success | null>(null);
  const {
    coords,
    status: geoStatus,
    request: requestLocation,
  } = useGeolocation();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!coords) {
      setError(
        "Veuillez partager votre position pour être alerté à proximité.",
      );
      return;
    }

    const form = new FormData(event.currentTarget);
    const profile = {
      firstName: String(form.get("firstName")),
      lastName: String(form.get("lastName")),
      email: String(form.get("email")),
      phoneNumber: String(form.get("phoneNumber")),
      bloodType: String(form.get("bloodType")),
      city: String(form.get("city")),
      age: Number(form.get("age")),
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    setBusy(true);
    try {
      // Génère l'identité Bitcoin (clé, empreinte, signature BIP-322) en local.
      const identity = await createDonorIdentity(profile);

      const donor = await createDonor.mutateAsync({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        password: String(form.get("password")),
        bloodType: profile.bloodType as BloodType,
        city: profile.city,
        age: profile.age,
        available: true,
        latitude: coords.latitude,
        longitude: coords.longitude,
        bitcoinAddress: identity.bitcoinAddress,
        profileHash: identity.profileHash,
        signature: identity.signature,
      });

      setSuccess({ donor, wif: identity.wif });
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'inscription a échoué.");
    } finally {
      setBusy(false);
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <CheckCircle2 className="size-12 text-emerald-500" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Vous êtes enregistré !</h2>
              <p className="text-muted-foreground text-sm">
                Votre profil a été signé et est en cours d'ancrage sur Bitcoin.
              </p>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
              <KeyRound className="size-4" />
              Conservez votre clé privée
            </p>
            <p className="text-muted-foreground text-xs">
              Elle prouve la propriété de votre profil. Nous ne la stockons pas
              : copiez-la et gardez-la en lieu sûr.
            </p>
            <div className="flex items-center gap-2">
              <code className="bg-background flex-1 truncate rounded border px-2 py-1.5 font-mono text-xs">
                {success.wif}
              </code>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Copier la clé"
                onClick={() => navigator.clipboard?.writeText(success.wif)}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          <Button asChild className="w-full">
            <Link href={`/verify/${success.donor.id}`}>
              <ShieldCheck className="size-4" />
              Voir ma preuve d'intégrité
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form className="space-y-5" onSubmit={onSubmit}>
          {error ? (
            <p className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
              <AlertCircle className="size-4 shrink-0" />
              {error}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Prénom" htmlFor="firstName">
              <Input
                id="firstName"
                name="firstName"
                required
                placeholder="Aïssatou"
              />
            </Field>
            <Field label="Nom" htmlFor="lastName">
              <Input
                id="lastName"
                name="lastName"
                required
                placeholder="Diallo"
              />
            </Field>
            <Field label="Groupe sanguin" htmlFor="bloodType">
              <Select id="bloodType" name="bloodType" defaultValue="O-">
                {BLOOD_TYPES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Âge" htmlFor="age">
              <Input
                id="age"
                name="age"
                type="number"
                min={18}
                max={120}
                required
                placeholder="28"
              />
            </Field>
            <Field label="Téléphone" htmlFor="phoneNumber">
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                placeholder="+221 77 123 45 67"
              />
            </Field>
            <Field label="Ville" htmlFor="city">
              <Input id="city" name="city" required placeholder="Dakar" />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="vous@exemple.africa"
              />
            </Field>
            <Field label="Mot de passe" htmlFor="password">
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="8 caractères minimum"
              />
            </Field>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full justify-start"
            onClick={requestLocation}
            disabled={geoStatus === "loading"}
          >
            <Navigation className="size-4" />
            {coords
              ? `Position : ${coords.latitude}, ${coords.longitude}`
              : geoStatus === "loading"
                ? "Localisation…"
                : "Partager ma position"}
          </Button>

          <p className="text-muted-foreground flex items-center gap-2 text-xs">
            <ShieldCheck className="size-3.5 shrink-0" />
            Votre profil est signé cryptographiquement (BIP-322) puis ancré sur
            Bitcoin. Aucune clé privée n'est transmise.
          </p>

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Signature & enregistrement…" : "Devenir donneur"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
