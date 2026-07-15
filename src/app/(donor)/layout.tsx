import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/**
 * Habillage de l'espace donneur: en-tête sobre, distinct de l'espace
 * structures. (Accès en mode démo; à protéger par une session donneur
 * une fois l'endpoint backend disponible.)
 */
export default function DonorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo variant="horizontal" height="1.6rem" />
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-sm sm:inline">
              Espace donneur
            </span>
            <ThemeToggle />
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Quitter</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
