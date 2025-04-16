import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlockchainEvent } from "@/lib/supabase";
import { formatTimeAgo } from "@/lib/utils";
import { Button } from "./button";
import { ChevronRight, Shield, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";

interface EntryPointDashboardProps {
  events: BlockchainEvent[];
  lastProcessedBlock: number;
}

export function EntryPointDashboard({ events, lastProcessedBlock }: EntryPointDashboardProps) {
  const router = useRouter();
  const entryPointEvents = events.filter(e => 
    e.contract_name === "EntryPoint" || 
    ["operation", "paymaster", "creation"].includes(e.event_type)
  );
  
  // Count different types of events
  const operationCount = entryPointEvents.filter(e => e.event_type === "operation").length;
  const paymasterCount = entryPointEvents.filter(e => e.event_type === "paymaster").length;
  const creationCount = entryPointEvents.filter(e => e.event_type === "creation").length;
  
  // Get most recent events
  const recentEvents = entryPointEvents.slice(0, 5);
  
  return (
    <Card className="shadow-md border border-border/60 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-950/30 to-blue-900/20 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              EntryPoint Activity
            </CardTitle>
            <CardDescription>
              Smart account operations via EIP-4337
            </CardDescription>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">
            Block #{lastProcessedBlock}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 border-b bg-muted/30">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background">
              <span className="text-2xl font-bold text-rose-500">{operationCount}</span>
              <span className="text-xs text-muted-foreground">Operations</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background">
              <span className="text-2xl font-bold text-cyan-500">{paymasterCount}</span>
              <span className="text-xs text-muted-foreground">Paymaster</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-background">
              <span className="text-2xl font-bold text-teal-500">{creationCount}</span>
              <span className="text-xs text-muted-foreground">Creations</span>
            </div>
          </div>
        </div>
        
        <div className="divide-y">
          {recentEvents.length > 0 ? (
            recentEvents.map((event) => (
              <div 
                key={event.event_id}
                className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center">
                  <Terminal className="h-4 w-4 mr-2 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{event.event_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimeAgo(event.timestamp)}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    event.event_type === "operation" ? "border-rose-200 text-rose-600 dark:border-rose-900 dark:text-rose-400" :
                    event.event_type === "paymaster" ? "border-cyan-200 text-cyan-600 dark:border-cyan-900 dark:text-cyan-400" :
                    "border-teal-200 text-teal-600 dark:border-teal-900 dark:text-teal-400"
                  }
                >
                  {event.event_type}
                </Badge>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              No EntryPoint events found
            </div>
          )}
        </div>
        
        <div className="p-4 bg-muted/30 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center"
            onClick={() => router.push("/blockchain-monitor?tab=events&contract=EntryPoint")}
          >
            View All EntryPoint Events
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
