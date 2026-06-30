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
        description="Recherchez et filtrez les donneurs volontaires du réseau."
        actions={
          <Button asChild>
            <Link href="/donors/new">
              <UserPlus className="size-4" />
              Enregistrer un donneur
            </Link>
          </Button>
        }
      />
      <DonorsExplorer />
    </>
  );
}
