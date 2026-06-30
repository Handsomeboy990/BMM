import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus } from "lucide-react";

import { DonorsExplorer } from "@/components/app/donors-explorer";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Annuaire des donneurs" };

export default function DonorsPage() {
  return (
    <>
      <PageHeader
        title="Annuaire des donneurs"
        description="Aperçu des donneurs volontaires du réseau. Données provisoires en attendant l'endpoint de liste."
        actions={
          <Button asChild variant="outline">
            <Link href="/donate">
              <UserPlus className="size-4" />
              Lien d'inscription donneur
            </Link>
          </Button>
        }
      />
      <DonorsExplorer />
    </>
  );
}
