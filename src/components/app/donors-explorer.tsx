"use client";

import {
  AlertCircle,
  BadgeCheck,
  Check,
  Phone,
  Search,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useDonors, useValidateDonor } from "@/lib/api/hooks";
import { BLOOD_TYPES } from "@/lib/api/resources";

function initialsOf(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase() || "DN";
}

export function DonorsExplorer() {
  const { data: donors, isLoading, isError, error } = useDonors();
  const validateDonor = useValidateDonor();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("tous");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (donors ?? []).filter((d) => {
      const fullName = `${d.firstName} ${d.lastName}`.toLowerCase();
      const matchesQuery =
        !q || fullName.includes(q) || d.city.toLowerCase().includes(q);
      const matchesGroup = group === "tous" || d.bloodType === group;
      return matchesQuery && matchesGroup;
    });
  }, [donors, query, group]);

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
            {BLOOD_TYPES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          Chargement de l'annuaire…
        </p>
      ) : isError ? (
        <p className="border-destructive/30 bg-destructive/10 text-destructive flex items-center justify-center gap-2 rounded-lg border px-4 py-8 text-sm">
          <AlertCircle className="size-4" />
          {error instanceof Error ? error.message : "Chargement impossible."}
        </p>
      ) : results.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <Users className="text-muted-foreground size-8" />
            <p className="font-medium">Aucun donneur validé</p>
            <p className="text-muted-foreground text-sm">
              Les donneurs apparaissent ici après validation d'un premier don.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-muted-foreground text-sm">
            {results.length} donneur{results.length > 1 ? "s" : ""} validé
            {results.length > 1 ? "s" : ""}
          </p>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {results.map((donor) => (
              <Card key={donor.id}>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start gap-3">
                    <Avatar
                      initials={initialsOf(donor.firstName, donor.lastName)}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate font-medium">
                          {donor.firstName} {donor.lastName}
                        </p>
                        {donor.validated ? (
                          <BadgeCheck className="text-primary size-4 shrink-0" />
                        ) : null}
                      </div>
                      <p className="text-muted-foreground truncate text-sm">
                        {donor.city} · {donor.age} ans
                      </p>
                    </div>
                    <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                      {donor.bloodType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant={donor.available ? "success" : "neutral"}>
                      {donor.available ? "Disponible" : "Indisponible"}
                    </Badge>
                    <Badge variant={donor.validated ? "primary" : "warning"}>
                      {donor.validated ? "Validé" : "À valider"}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <a href={`tel:${donor.phoneNumber.replace(/\s/g, "")}`}>
                        <Phone className="size-4" />
                        Contacter
                      </a>
                    </Button>
                    {!donor.validated ? (
                      <Button
                        size="sm"
                        onClick={() => validateDonor.mutate(donor.id)}
                        disabled={validateDonor.isPending}
                      >
                        <Check className="size-4" />
                        Valider
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
