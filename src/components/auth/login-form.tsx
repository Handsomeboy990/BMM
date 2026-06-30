"use client";

import { AlertCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthField } from "@/components/auth/auth-field";
import { PasswordField } from "@/components/auth/password-field";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/lib/api/hooks";

export function LoginForm() {
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
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Connexion impossible.");
    }
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {error ? (
        <p className="border-destructive/30 bg-destructive/10 text-destructive flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
          <AlertCircle className="size-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <AuthField
        label="Email professionnel"
        icon={Mail}
        name="email"
        type="email"
        autoComplete="email"
        required
        placeholder="contact@hopital.bj"
      />
      <PasswordField
        name="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
        hint={
          <Link
            href="/forgot-password"
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            Mot de passe oublié ?
          </Link>
        }
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
  );
}
