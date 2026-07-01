"use client";

import { Droplet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { appNav } from "@/config/app-navigation";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-card hidden w-64 shrink-0 flex-col border-r lg:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6 font-semibold">
        <Droplet className="text-primary size-5" />
        {siteConfig.name}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-6">
        {appNav.map((group) => (
          <div key={group.title}>
            <p className="text-muted-foreground px-3 pb-2 text-xs font-medium tracking-wider uppercase">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge ? (
                        <Badge variant="danger" className="px-2 py-0">
                          {item.badge}
                        </Badge>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t p-4">
        <p className="text-muted-foreground text-xs">
          Hackathon Bitcoin Mastermind 2026
        </p>
      </div>
    </aside>
  );
}
