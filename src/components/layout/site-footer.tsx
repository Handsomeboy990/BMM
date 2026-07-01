import { Droplet } from "lucide-react";

import { Container } from "@/components/layout/container";
import { footerNav } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  return (
    <footer className="bg-secondary/30 border-t">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="flex flex-col gap-3">
          <span className="flex items-center gap-2 font-semibold">
            <Droplet className="text-primary" />
            {siteConfig.name}
          </span>
          <p className="text-muted-foreground max-w-xs text-sm">
            Mieux gérer les donneurs de sang pour sauver plus de vies, partout
            en Afrique.
          </p>
        </div>

        {footerNav.map((group) => (
          <div key={group.title} className="flex flex-col gap-3">
            <span className="text-sm font-medium">{group.title}</span>
            <ul className="flex flex-col gap-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="text-muted-foreground flex flex-col items-center justify-between gap-2 border-t py-6 text-sm sm:flex-row">
        <span>
          {new Date().getFullYear()} {siteConfig.name}. Tous droits réservés.
        </span>
        <span>Hackathon Bitcoin Mastermind 2026</span>
      </Container>
    </footer>
  );
}
