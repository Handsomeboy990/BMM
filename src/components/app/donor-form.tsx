"use client";

import { CheckCircle2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { bloodGroups } from "@/lib/mock/blood";

export function DonorForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
          <CheckCircle2 className="size-12 text-emerald-500" />
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Donneur enregistré</h2>
            <p className="text-muted-foreground text-sm">
              Le profil a été créé (données simulées). Une carte vérifiable sera
              générée et ancrée sur Bitcoin.
            </p>
          </div>
          <Button variant="outline" onClick={() => setSubmitted(false)}>
            Enregistrer un autre donneur
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
        >
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
            <Field label="Groupe sanguin" htmlFor="group">
              <Select id="group" name="group" required defaultValue="">
                <option value="" disabled>
                  Sélectionner…
                </option>
                {bloodGroups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Date de naissance" htmlFor="birth">
              <Input id="birth" name="birth" type="date" required />
            </Field>
            <Field label="Téléphone" htmlFor="phone">
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="+221 77 123 45 67"
              />
            </Field>
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="donneur@exemple.africa"
              />
            </Field>
            <Field label="Ville" htmlFor="city">
              <Input id="city" name="city" required placeholder="Dakar" />
            </Field>
            <Field label="Pays" htmlFor="country">
              <Input
                id="country"
                name="country"
                required
                placeholder="Sénégal"
              />
            </Field>
          </div>

          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              required
              className="border-input mt-0.5 size-4 rounded"
            />
            <span className="text-muted-foreground">
              Le donneur consent à être contacté en cas d'urgence et à
              l'enregistrement de ses dons sur la plateforme.
            </span>
          </label>

          <div className="flex justify-end gap-2">
            <Button type="reset" variant="outline">
              Réinitialiser
            </Button>
            <Button type="submit">Enregistrer le donneur</Button>
          </div>
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
