"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Badge } from "@/components/ui/badge";
import { appNav } from "@/config/app-navigation";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-card hidden w-64 shrink-0 flex-col border-r lg:flex">
      <Link href="/dashboard" className="flex h-16 items-center border-b px-6">
        <BrandLogo />
      </Link>

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
        <p className="text-muted-foreground text-xs">Time's Care 2026</p>
      </div>
    </aside>
  );
}
