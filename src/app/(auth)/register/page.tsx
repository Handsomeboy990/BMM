import { Mail, MapPin, ShieldCheck, User } from "lucide-react";
import type { Metadata } from "next";

import { AuthField } from "@/components/auth/auth-field";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { bloodGroups } from "@/lib/mock/blood";

export const metadata: Metadata = { title: "Inscription" };

export default function RegisterPage() {
  return (
    <div className="space-y-7">
      <AuthTabs />

      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          Rejoignez le réseau
        </h1>
        <p className="text-muted-foreground text-sm">
          Quelques minutes pour devenir donneur et sauver des vies près de chez
          vous.
        </p>
      </div>

      <form className="space-y-5" action="/dashboard">
        <AuthField
          label="Nom complet"
          icon={User}
          name="name"
          autoComplete="name"
          required
          placeholder="Aïssatou Diallo"
        />
        <AuthField
          label="Email"
          icon={Mail}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="vous@exemple.africa"
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="group">Groupe sanguin</Label>
            <Select id="group" name="group" defaultValue="" className="h-11">
              <option value="" disabled>
                Choisir…
              </option>
              {bloodGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </div>
          <AuthField
            label="Ville"
            icon={MapPin}
            name="city"
            autoComplete="address-level2"
            required
            placeholder="Dakar"
          />
        </div>
        <PasswordField
          name="password"
          autoComplete="new-password"
          required
          placeholder="8 caractères minimum"
        />
        <Button type="submit" size="lg" className="w-full">
          Créer mon compte
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-xs leading-relaxed">
        En continuant, vous acceptez d'être contacté en cas d'urgence
        compatible.{" "}
        <ShieldCheck className="inline size-3.5 align-text-bottom" /> Vos
        données restent protégées.
      </p>
    </div>
  );
}
