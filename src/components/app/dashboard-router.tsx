"use client";

import Link from "next/link";

import { DashboardOverview } from "@/components/app/dashboard-overview";
import { PageHeader } from "@/components/app/page-header";
import { SuperAdminDashboard } from "@/components/app/super-admin-dashboard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

/** Aiguille vers le bon tableau de bord selon le rôle de l'utilisateur. */
export function DashboardRouter() {
  const { user } = useAuth();
  const isSuperAdmin = user?.role === "super_admin";

  if (isSuperAdmin) {
    return (
      <>
        <PageHeader
          title="Console super-admin"
          description="Pilotage de l'ensemble du réseau : organisations, donneurs et urgences."
        />
        <SuperAdminDashboard />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble des urgences et campagnes de votre structure."
        actions={
          <Button asChild>
            <Link href="/alerts">Déclencher une alerte</Link>
          </Button>
        }
      />
      <DashboardOverview />
    </>
  );
}
