"use client";

import { BadgeCheck, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { bloodGroups } from "@/lib/mock/blood";
import {
  donorStatusBadge,
  donorStatusLabel,
  donors,
  type DonorStatus,
} from "@/lib/mock/donors";

const statuses: Array<DonorStatus | "tous"> = [
  "tous",
  "disponible",
  "recent",
  "indisponible",
];

export function DonorsExplorer() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("tous");
  const [status, setStatus] = useState("tous");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return donors.filter((d) => {
      const matchesQuery =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q);
      const matchesGroup = group === "tous" || d.group === group;
      const matchesStatus = status === "tous" || d.status === status;
      return matchesQuery && matchesGroup && matchesStatus;
    });
  }, [query, group, status]);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un nom, une ville…"
              className="pl-9"
            />
          </div>
          <Select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="sm:w-40"
            aria-label="Groupe sanguin"
          >
            <option value="tous">Tous les groupes</option>
            {bloodGroups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="sm:w-44"
            aria-label="Disponibilité"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s === "tous" ? "Toutes dispos." : donorStatusLabel[s]}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      <p className="text-muted-foreground text-sm">
        {results.length} donneur{results.length > 1 ? "s" : ""} trouvé
        {results.length > 1 ? "s" : ""}
      </p>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {results.map((donor) => (
          <Card key={donor.id}>
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <Avatar initials={donor.initials} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate font-medium">{donor.name}</p>
                    {donor.verified ? (
                      <BadgeCheck className="text-primary size-4 shrink-0" />
                    ) : null}
                  </div>
                  <p className="text-muted-foreground truncate text-sm">
                    {donor.city}, {donor.country}
                  </p>
                </div>
                <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                  {donor.group}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <Badge variant={donorStatusBadge[donor.status]}>
                  {donorStatusLabel[donor.status]}
                </Badge>
                <span className="text-muted-foreground">
                  {donor.donations} dons
                </span>
              </div>

              <Button variant="outline" size="sm" className="w-full" asChild>
                <a href={`tel:${donor.phone.replace(/\s/g, "")}`}>
                  <Phone className="size-4" />
                  Contacter
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}

        {results.length === 0 ? (
          <p className="text-muted-foreground col-span-full py-12 text-center text-sm">
            Aucun donneur ne correspond à ces critères.
          </p>
        ) : null}
      </div>
    </div>
  );
}
