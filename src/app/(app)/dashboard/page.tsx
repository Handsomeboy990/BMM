import type { Metadata } from "next";
import Link from "next/link";

import { DashboardOverview } from "@/components/app/dashboard-overview";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Tableau de bord" };

export default function DashboardPage() {
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
