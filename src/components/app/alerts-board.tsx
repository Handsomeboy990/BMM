"use client";

import { Clock, MapPin, Plus, Users, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select } from "@/components/ui/select";
import {
  alertStateBadge,
  alertStateLabel,
  emergencyAlerts,
  urgencyBadge,
  urgencyLabel,
  type AlertUrgency,
  type EmergencyAlert,
} from "@/lib/mock/alerts";
import { bloodGroups, type BloodGroup } from "@/lib/mock/blood";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.round(h / 24)} j`;
}

export function AlertsBoard() {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(emergencyAlerts);
  const [open, setOpen] = useState(false);

  function handleCreate(form: FormData) {
    const newAlert: EmergencyAlert = {
      id: `alt_${Math.floor(Math.random() * 9000) + 1000}`,
      group: form.get("group") as BloodGroup,
      unitsNeeded: Number(form.get("units")) || 1,
      unitsCollected: 0,
      hospital: String(form.get("hospital") || "Structure de santé"),
      city: String(form.get("city") || ""),
      country: String(form.get("country") || ""),
      urgency: form.get("urgency") as AlertUrgency,
      state: "ouverte",
      createdAt: new Date().toISOString(),
      responders: 0,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      {open ? (
        <Card>
          <CardContent className="p-6">
            <form action={handleCreate} className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Nouvelle alerte d'urgence</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                >
                  <X className="size-4" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="group">Groupe recherché</Label>
                  <Select id="group" name="group" defaultValue="O-">
                    {bloodGroups.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Poches nécessaires</Label>
                  <Input
                    id="units"
                    name="units"
                    type="number"
                    min={1}
                    defaultValue={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Niveau d'urgence</Label>
                  <Select id="urgency" name="urgency" defaultValue="haute">
                    <option value="vitale">Vitale</option>
                    <option value="haute">Haute</option>
                    <option value="moderee">Modérée</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hospital">Structure de santé</Label>
                  <Input
                    id="hospital"
                    name="hospital"
                    required
                    placeholder="Hôpital Principal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" name="city" required placeholder="Dakar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="Sénégal"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Diffuser l'alerte</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="flex justify-end">
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            Nouvelle alerte
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {alerts.map((alert) => {
          const progress = Math.round(
            (alert.unitsCollected / alert.unitsNeeded) * 100,
          );
          return (
            <Card key={alert.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full text-base font-semibold">
                      {alert.group}
                    </span>
                    <div>
                      <p className="font-medium">{alert.hospital}</p>
                      <p className="text-muted-foreground flex items-center gap-1 text-sm">
                        <MapPin className="size-3.5" />
                        {alert.city}, {alert.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={urgencyBadge[alert.urgency]}>
                      {urgencyLabel[alert.urgency]}
                    </Badge>
                    <Badge variant={alertStateBadge[alert.state]}>
                      {alertStateLabel[alert.state]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {alert.unitsCollected} / {alert.unitsNeeded} poches
                      collectées
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    {alert.responders} réponses
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {timeAgo(alert.createdAt)}
                  </span>
                  <span className="ml-auto font-mono text-xs">{alert.id}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
