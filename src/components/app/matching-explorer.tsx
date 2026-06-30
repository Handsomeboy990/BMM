"use client";

import { BadgeCheck, Phone, Send } from "lucide-react";
import { useMemo, useState } from "react";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { bloodGroups, compatibility, type BloodGroup } from "@/lib/mock/blood";
import { donorStatusBadge, donorStatusLabel, donors } from "@/lib/mock/donors";

export function MatchingExplorer() {
  const [recipient, setRecipient] = useState<BloodGroup>("O-");
  const [onlyAvailable, setOnlyAvailable] = useState(true);

  const compatibleGroups = compatibility[recipient];

  const matches = useMemo(() => {
    return donors
      .filter((d) => compatibleGroups.includes(d.group))
      .filter((d) => !onlyAvailable || d.status === "disponible")
      .sort((a, b) => b.donations - a.donations);
  }, [compatibleGroups, onlyAvailable]);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <div className="space-y-2 sm:w-56">
            <Label htmlFor="recipient">Groupe du receveur</Label>
            <Select
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value as BloodGroup)}
            >
              {bloodGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <Label>Donneurs compatibles</Label>
            <div className="flex flex-wrap gap-1.5">
              {compatibleGroups.map((g) => (
                <Badge key={g} variant="primary">
                  {g}
                </Badge>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="size-4 rounded"
            />
            Disponibles uniquement
          </label>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {matches.length} donneur{matches.length > 1 ? "s" : ""} compatible
          {matches.length > 1 ? "s" : ""} avec {recipient}
        </p>
        {matches.length > 0 ? (
          <Button size="sm">
            <Send className="size-4" />
            Alerter ces donneurs
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {matches.map((donor) => (
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

        {matches.length === 0 ? (
          <p className="text-muted-foreground col-span-full py-12 text-center text-sm">
            Aucun donneur compatible disponible. Élargissez les critères.
          </p>
        ) : null}
      </div>
    </div>
  );
}
