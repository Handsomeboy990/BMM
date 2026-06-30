import { CalendarDays, MapPin, Plus, Target, Users } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  campaignStateBadge,
  campaignStateLabel,
  campaigns,
} from "@/lib/mock/campaigns";

export const metadata: Metadata = { title: "Campagnes de don" };

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
});

export default function CampaignsPage() {
  return (
    <>
      <PageHeader
        title="Campagnes de don"
        description="Organisez et suivez les campagnes de collecte à travers le continent."
        actions={
          <Button>
            <Plus className="size-4" />
            Créer une campagne
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((campaign) => {
          const metric =
            campaign.state === "a_venir"
              ? {
                  label: "Inscrits",
                  value: campaign.registered,
                  total: campaign.goal,
                }
              : {
                  label: "Poches collectées",
                  value: campaign.collected,
                  total: campaign.goal,
                };
          const progress = Math.round((metric.value / metric.total) * 100);

          return (
            <Card key={campaign.id} className="overflow-hidden">
              <div className="relative aspect-[16/9]">
                <Image
                  src={campaign.cover}
                  alt={campaign.title}
                  fill
                  sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 90vw"
                  className="object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={campaignStateBadge[campaign.state]}>
                    {campaignStateLabel[campaign.state]}
                  </Badge>
                </div>
              </div>
              <CardContent className="space-y-4 p-5">
                <div className="space-y-1">
                  <h3 className="leading-tight font-semibold">
                    {campaign.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {campaign.organizer}
                  </p>
                </div>

                <div className="text-muted-foreground space-y-1.5 text-sm">
                  <p className="flex items-center gap-2">
                    <MapPin className="size-3.5" />
                    {campaign.venue}, {campaign.city}
                  </p>
                  <p className="flex items-center gap-2">
                    <CalendarDays className="size-3.5" />
                    {dateFmt.format(new Date(campaign.startDate))} –{" "}
                    {dateFmt.format(new Date(campaign.endDate))}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Target className="size-3.5" />
                      {metric.label}
                    </span>
                    <span className="font-medium">
                      {metric.value} / {metric.total}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-muted-foreground flex items-center gap-1 text-sm">
                    <Users className="size-3.5" />
                    {campaign.registered} inscrits
                  </span>
                  <Button variant="outline" size="sm">
                    Gérer
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
