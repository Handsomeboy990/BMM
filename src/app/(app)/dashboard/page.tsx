import {
  Activity,
  Bell,
  CalendarHeart,
  Droplet,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  alertStateBadge,
  alertStateLabel,
  emergencyAlerts,
  urgencyBadge,
  urgencyLabel,
} from "@/lib/mock/alerts";
import { stockStatus, stockStatusBadge } from "@/lib/mock/blood";
import {
  dashboardMetrics,
  recentActivity,
  stockLevels,
} from "@/lib/mock/dashboard";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Tableau de bord" };

const activityIcon = {
  alerte: Bell,
  don: Droplet,
  campagne: CalendarHeart,
  preuve: ShieldCheck,
} as const;

export default function DashboardPage() {
  const openAlerts = emergencyAlerts.filter((a) => a.state !== "resolue");

  return (
    <>
      <PageHeader
        title="Tableau de bord"
        description="Vue d'ensemble du réseau de donneurs et des urgences en cours."
        actions={
          <Button asChild>
            <Link href="/alerts">Déclencher une alerte</Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => {
          const Trend = metric.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={metric.key}>
              <CardContent className="space-y-2 p-6">
                <p className="text-muted-foreground text-sm">{metric.label}</p>
                <div className="flex items-end justify-between gap-2">
                  <span className="text-3xl font-semibold tracking-tight">
                    {metric.value}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1 text-sm font-medium",
                      metric.trend === "up"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-emerald-600 dark:text-emerald-400",
                    )}
                  >
                    <Trend className="size-4" />
                    {metric.delta}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">{metric.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Stock par groupe sanguin */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Stock par groupe sanguin</CardTitle>
            <Droplet className="text-primary size-5" />
          </CardHeader>
          <CardContent className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {stockLevels.map((stock) => {
              const status = stockStatus(stock.level);
              return (
                <div key={stock.group} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{stock.group}</span>
                    <Badge variant={stockStatusBadge[status]}>{status}</Badge>
                  </div>
                  <Progress
                    value={stock.level}
                    indicatorClassName={cn(
                      status === "critique" && "bg-destructive",
                      status === "faible" && "bg-amber-500",
                      status === "stable" && "bg-emerald-500",
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Activité récente */}
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Activité récente</CardTitle>
            <Activity className="text-muted-foreground size-5" />
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {recentActivity.map((item) => {
              const Icon = activityIcon[item.kind];
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="bg-secondary flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Icon className="size-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm leading-snug">{item.text}</p>
                    <p className="text-muted-foreground text-xs">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Alertes en cours */}
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>Alertes en cours</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/alerts">Tout voir</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {openAlerts.map((alert) => {
            const progress = Math.round(
              (alert.unitsCollected / alert.unitsNeeded) * 100,
            );
            return (
              <div
                key={alert.id}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-full text-sm font-semibold">
                    {alert.group}
                  </span>
                  <div>
                    <p className="font-medium">
                      {alert.hospital}, {alert.city}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {alert.unitsCollected}/{alert.unitsNeeded} poches ·{" "}
                      {alert.responders} réponses
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={urgencyBadge[alert.urgency]}>
                    {urgencyLabel[alert.urgency]}
                  </Badge>
                  <Badge variant={alertStateBadge[alert.state]}>
                    {alertStateLabel[alert.state]}
                  </Badge>
                  <div className="hidden w-32 sm:block">
                    <Progress value={progress} />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </>
  );
}
