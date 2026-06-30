"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { appNav } from "@/config/app-navigation";
import { currentUser } from "@/lib/mock/account";
import { cn } from "@/lib/utils";

const flatNav = appNav.flatMap((group) => group.items);

export function AppTopbar() {
  const pathname = usePathname();

  return (
    <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        {/* Navigation horizontale repliée sur mobile */}
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto lg:hidden">
          {flatNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-md transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent",
                )}
              >
                <Icon className="size-4" />
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-1 lg:block" />

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="/alerts">
              <Plus className="size-4" />
              Nouvelle alerte
            </Link>
          </Button>
          <ThemeToggle />
          <Link
            href="/cards"
            className="flex items-center gap-2 rounded-full pl-1 transition-opacity hover:opacity-80"
          >
            <Avatar initials={currentUser.initials} className="size-9" />
            <span className="hidden text-sm font-medium md:inline">
              {currentUser.name}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
