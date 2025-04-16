import * as React from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";
import { Activity, Clock, TrendingUp, PieChart } from "lucide-react";
import { motion } from "framer-motion";

interface DashboardStatProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  color?: string;
  className?: string;
}

export function DashboardStat({
  title,
  value,
  change,
  icon,
  color = "primary",
  className,
}: DashboardStatProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <motion.h3 
              className="text-2xl font-bold mt-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {value}
            </motion.h3>
            {change && (
              <p className={cn(
                "text-xs font-medium mt-1",
                change.isPositive ? "text-green-500" : "text-red-500"
              )}>
                <span className="inline-flex items-center">
                  {change.isPositive ? "↑" : "↓"}
                  {change.value}%
                </span>
                <span className="text-muted-foreground ml-1">since last hour</span>
              </p>
            )}
          </div>
          <div className={cn(
            "h-12 w-12 rounded-full flex items-center justify-center",
            color === "primary" && "bg-primary/10 text-primary",
            color === "secondary" && "bg-secondary/10 text-secondary",
            color === "green" && "bg-green-500/10 text-green-500",
            color === "blue" && "bg-blue-500/10 text-blue-500",
            color === "indigo" && "bg-indigo-500/10 text-indigo-500",
            color === "amber" && "bg-amber-500/10 text-amber-500",
          )}>
            {icon || <Activity className="h-5 w-5" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BlockchainStats({
  totalEvents,
  eventsPerHour,
  connectedContracts,
  lastEventTime,
}: {
  totalEvents: number;
  eventsPerHour: number;
  connectedContracts: number;
  lastEventTime: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <DashboardStat
        title="Total Events"
        value={totalEvents}
        icon={<Activity className="h-5 w-5" />}
        color="primary"
      />
      <DashboardStat
        title="Events/Hour"
        value={eventsPerHour}
        change={{
          value: 5.2,
          isPositive: true
        }}
        icon={<TrendingUp className="h-5 w-5" />}
        color="green"
      />
      <DashboardStat
        title="Monitored Contracts"
        value={connectedContracts}
        icon={<PieChart className="h-5 w-5" />}
        color="blue"
      />
      <DashboardStat
        title="Last Event"
        value={typeof lastEventTime === 'number' ? `${Math.round((Date.now() - lastEventTime) / 1000)}s ago` : 'N/A'}
        icon={<Clock className="h-5 w-5" />}
        color="amber"
      />
    </div>
  );
}
