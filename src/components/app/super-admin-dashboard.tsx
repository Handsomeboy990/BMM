"use client";

import {
  AlertCircle,
  BadgeCheck,
  Bell,
  Building2,
  Check,
  Droplet,
  MapPin,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useDonors,
  useEmergencies,
  useOrganizations,
  useVerifyOrganization,
} from "@/lib/api/hooks";
import type { OrganizationType } from "@/lib/api/resources";

const orgTypeLabel: Record<OrganizationType, string> = {
  hospital: "Hôpital",
  ong: "ONG",
  collect: "Centre de collecte",
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export function SuperAdminDashboard() {
  const orgs = useOrganizations();
  const donors = useDonors();
  const emergencies = useEmergencies();
  const verifyOrg = useVerifyOrganization();

  const activeEmergencies =
    emergencies.data?.filter((e) => e.status === "active") ?? [];
  const pendingOrgs = orgs.data?.filter((o) => !o.verified) ?? [];

  const metrics = [
    {
      key: "orgs",
      label: "Organisations",
      value: orgs.isLoading ? "…" : String(orgs.data?.length ?? 0),
      icon: Building2,
    },
    {
      key: "pending",
      label: "À vérifier",
      value: orgs.isLoading ? "…" : String(pendingOrgs.length),
      icon: ShieldCheck,
    },
    {
      key: "donors",
      label: "Donneurs validés",
      value: donors.isLoading ? "…" : String(donors.data?.length ?? 0),
      icon: Droplet,
    },
    {
      key: "emergencies",
      label: "Urgences actives",
      value: emergencies.isLoading ? "…" : String(activeEmergencies.length),
      icon: Bell,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.key}>
              <CardContent className="space-y-2 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground text-sm">
                    {metric.label}
                  </p>
                  <Icon className="text-primary size-5" />
                </div>
                <span className="text-3xl font-semibold tracking-tight">
                  {metric.value}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Organisations à gérer */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Organisations</CardTitle>
            <Building2 className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {orgs.isLoading ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                Chargement…
              </p>
            ) : (
              orgs.data?.map((org) => (
                <div
                  key={org.id}
                  className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-secondary flex size-10 shrink-0 items-center justify-center rounded-full">
                      <Building2 className="size-5" />
                    </span>
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-muted-foreground flex items-center gap-1 text-sm">
                        <MapPin className="size-3.5" />
                        {org.city} · {orgTypeLabel[org.type]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {org.verified ? (
                      <Badge variant="success">
                        <BadgeCheck className="size-3.5" />
                        Vérifiée
                      </Badge>
                    ) : (
                      <>
                        <Badge variant="warning">En attente</Badge>
                        <Button
                          size="sm"
                          onClick={() => verifyOrg.mutate(org.id)}
                          disabled={verifyOrg.isPending}
                        >
                          <Check className="size-4" />
                          Vérifier
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Urgences plateforme */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Urgences (plateforme)</CardTitle>
            <Bell className="text-primary size-5" />
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {emergencies.isLoading ? (
              <p className="text-muted-foreground py-6 text-center text-sm">
                Chargement…
              </p>
            ) : activeEmergencies.length === 0 ? (
              <p className="text-muted-foreground flex items-center gap-2 py-6 text-sm">
                <AlertCircle className="size-4" />
                Aucune urgence active.
              </p>
            ) : (
              activeEmergencies.map((e) => (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full text-sm font-semibold">
                      {e.bloodType}
                    </span>
                    <div>
                      <p className="text-sm font-medium">
                        {e.quantityNeeded} poche
                        {e.quantityNeeded > 1 ? "s" : ""}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1 text-xs">
                        <MapPin className="size-3" />
                        {e.city} · {dateFmt.format(new Date(e.createdAt))}
                      </p>
                    </div>
                  </div>
                  <Badge variant="danger">Active</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
