"use client";

import { AlertCircle, Droplet, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthField } from "@/components/auth/auth-field";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/lib/api/hooks";

export function DonorLoginForm() {
  const router = useRouter();
  const login = useLogin();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      await login.mutateAsync({
        email: String(form.get("email")),
        password: String(form.get("password")),
      });
      router.replace("/donneur");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="space-y-1.5">
        <span className="text-primary inline-flex items-center gap-1.5 text-sm font-medium">
          <Droplet className="size-4" />
          Espace donneur
        </span>
        <h1 className="text-2xl font-semibold tracking-tight">Se connecter</h1>
        <p className="text-muted-foreground text-sm">
          Suivez vos dons et vos récompenses Lightning.
        </p>
      </div>

      <form className="space-y-5" onSubmit={onSubmit}>
        {error ? (
          <p className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
            <AlertCircle className="size-4 shrink-0" />
            {error}
          </p>
        ) : null}

        <AuthField
          label="Email"
          icon={Mail}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="vous@exemple.bj"
        />
        <PasswordField
          name="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={login.isPending}
        >
          {login.isPending ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="text-muted-foreground text-center text-sm">
        Pas encore donneur ?{" "}
        <Link
          href="/donate"
          className="text-primary font-medium hover:underline"
        >
          S'inscrire
        </Link>
      </p>
    </div>
  );
}
