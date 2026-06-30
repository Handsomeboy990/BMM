import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { DonorForm } from "@/components/app/donor-form";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Enregistrer un donneur" };

export default function NewDonorPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <PageHeader
        title="Enregistrer un donneur"
        description="Ajoutez un donneur volontaire au réseau panafricain."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/donors">
              <ArrowLeft className="size-4" />
              Retour
            </Link>
          </Button>
        }
      />
      <DonorForm />
    </div>
  );
}
