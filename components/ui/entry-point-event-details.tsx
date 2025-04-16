import * as React from "react";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";

interface EntryPointEventDetailsProps {
  eventName: string;
  eventData: any;
}

export function EntryPointEventDetails({ 
  eventName, 
  eventData 
}: EntryPointEventDetailsProps) {
  if (!eventData || Object.keys(eventData).length === 0) {
    return <p className="text-sm text-muted-foreground">No details available</p>;
  }

  // Format different EntryPoint events with specialized visualizations
  switch (eventName) {
    case "ThaoTacNguoiDungDuocThucThi":
      return (
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Sender:</span>
              <span className="text-sm font-mono">{eventData[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Nonce:</span>
              <span className="text-sm font-mono">{eventData[1]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge 
                variant={eventData[2] ? "default" : "destructive"} 
                className={eventData[2] ? "bg-green-500" : ""}
              >
                {eventData[2] ? "Success" : "Failed"}
              </Badge>
            </div>
          </div>
          <div className={cn(
            "p-2 rounded-md text-xs",
            eventData[2] ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" :
                        "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300"
          )}>
            {eventData[2] ? 
              "The user operation was successfully executed." : 
              "The user operation failed during execution."}
          </div>
        </div>
      );

    case "ThucThiThaoTac":
      return (
        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Sender:</span>
              <span className="text-sm font-mono">{eventData[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge 
                variant={eventData[1] ? "default" : "destructive"} 
                className={eventData[1] ? "bg-green-500" : ""}
              >
                {eventData[1] ? "Success" : "Failed"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Gas Used:</span>
              <span className="text-sm font-mono">{eventData[2]} units</span>
            </div>
          </div>
        </div>
      );

    case "PaymasterXacThucThanhCong":
      return (
        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Paymaster:</span>
              <span className="text-sm font-mono truncate max-w-[150px]">{eventData[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Sender:</span>
              <span className="text-sm font-mono truncate max-w-[150px]">{eventData[1]}</span>
            </div>
          </div>
          <div className="p-2 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 text-xs">
            The paymaster has successfully validated the user operation and agreed to pay for gas.
          </div>
        </div>
      );

    case "TaoNguoiGuiThanhCong":
      return (
        <div className="space-y-2">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Created Address:</span>
              <span className="text-sm font-mono truncate max-w-[150px]">{eventData[0]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Gas Used:</span>
              <span className="text-sm font-mono">{eventData[1]} units</span>
            </div>
          </div>
          <div className="p-2 rounded-md bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300 text-xs">
            A new smart contract wallet has been deployed successfully.
          </div>
        </div>
      );
      
    default:
      // Generic display for other event types
      return (
        <div className="grid gap-2">
          {Object.entries(eventData).map(([key, value], index) => (
            <div key={index} className="flex justify-between">
              <span className="text-sm font-medium">Parameter {parseInt(key) + 1}:</span>
              <span className="text-sm font-mono truncate max-w-[150px]">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
              </span>
            </div>
          ))}
        </div>
      );
  }
}
