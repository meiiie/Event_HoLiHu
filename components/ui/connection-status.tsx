import React from "react";
import { Badge } from "./badge";
import { Button } from "./button";
import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  isConnected: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  currentBlock?: number;
  className?: string;
}

export function ConnectionStatus({
  isConnected,
  isLoading,
  onRefresh,
  currentBlock,
  className,
}: ConnectionStatusProps) {
  return (
    <div 
      className={cn(
        "flex items-center gap-2 transition-all",
        className
      )}
    >
      <div className="relative group">
        <Badge
          className={cn(
            "px-3 py-1 transition-colors",
            isConnected
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50"
              : isLoading
              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800/50"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50"
          )}
        >
          <span className="flex items-center">
            {isConnected ? (
              <>
                <motion.div
                  className="h-2 w-2 rounded-full bg-green-500 dark:bg-green-400 mr-1.5"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Connected
              </>
            ) : isLoading ? (
              <>
                <motion.div
                  className="h-2 w-2 rounded-full bg-amber-500 dark:bg-amber-400 mr-1.5"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                Connecting...
              </>
            ) : (
              <>
                <motion.div
                  className="h-2 w-2 rounded-full bg-red-500 dark:bg-red-400 mr-1.5"
                />
                Disconnected
              </>
            )}
          </span>
        </Badge>
        
        {isConnected && currentBlock && (
          <div className="absolute -bottom-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm border rounded px-2 py-1 text-xs shadow-sm pointer-events-none">
            Current block: {currentBlock}
          </div>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onRefresh}
        className="h-8 border-border/50"
        disabled={isLoading}
      >
        <RefreshCw
          className={cn(
            "h-3.5 w-3.5 mr-1",
            isLoading && "animate-spin"
          )}
        />
        {isLoading ? "Connecting" : "Refresh"}
      </Button>
    </div>
  );
}
