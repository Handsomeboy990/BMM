import { Mail, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AuthField } from "@/components/auth/auth-field";
import { AuthTabs } from "@/components/auth/auth-tabs";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <AuthTabs />

      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">Bon retour</h1>
        <p className="text-muted-foreground text-sm">
          Reprenez le pilotage de votre réseau de donneurs.
        </p>
      </div>

      <form className="space-y-5" action="/dashboard">
        <AuthField
          label="Email"
          icon={Mail}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="vous@exemple.africa"
        />
        <PasswordField
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          hint={
            <Link
              href="#"
              className="text-muted-foreground hover:text-foreground text-xs"
            >
              Mot de passe oublié ?
            </Link>
          }
        />
        <Button type="submit" size="lg" className="w-full">
          Se connecter
        </Button>
      </form>

      <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
        <ShieldCheck className="size-3.5" />
        Connexion chiffrée · dons ancrés sur Bitcoin
      </p>
    </div>
  );
}
