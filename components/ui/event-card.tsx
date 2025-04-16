import * as React from "react"
import { cn } from "@/lib/utils"
import { formatTimeAgo, formatEventName } from "@/lib/utils"
import type { BlockchainEvent } from "@/lib/supabase"
import { motion } from "framer-motion"
import { ExternalLink, ChevronRight, Copy } from "lucide-react"
import { Badge } from "./badge"
import { Button } from "./button"
import { useToast } from "@/hooks/use-toast"
import { getTransactionUrl } from "@/lib/contract-addresses"

interface EventCardProps extends React.HTMLAttributes<HTMLDivElement> {
  event: BlockchainEvent
  formatEventType: (type: string) => { label: string; color: string }
  expanded?: boolean
  onToggleExpand?: () => void
}

export function EventCard({ 
  event, 
  formatEventType, 
  expanded = false,
  onToggleExpand,
  className, 
  ...props 
}: EventCardProps) {
  const { toast } = useToast()
  const eventTypeInfo = formatEventType(event.event_type)
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard`,
      duration: 3000,
    })
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group rounded-lg border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md",
        expanded && "ring-1 ring-primary/20",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={onToggleExpand}>
        <div className="flex items-center space-x-3">
          <Badge className={eventTypeInfo.color}>
            {eventTypeInfo.label}
          </Badge>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {formatEventName(event.event_name)}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTimeAgo(event.timestamp)}
          </span>
          <motion.div
            animate={{ rotate: expanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </div>
      
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2 }}
          className="mt-4 pt-4 border-t text-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Transaction Details</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Block:</span>
                  <div className="flex items-center">
                    <span className="font-mono">{event.block_number}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(event.block_number.toString(), "Block number")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hash:</span>
                  <div className="flex items-center">
                    <span className="font-mono text-xs truncate max-w-[150px]">
                      {event.transaction_hash}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(event.transaction_hash, "Transaction hash")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{new Date(event.timestamp).toLocaleString("vi-VN")}</span>
                </div>
              </div>
              
              <a
                href={getTransactionUrl(event.transaction_hash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                View on Explorer
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Event Data</h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 styled-scrollbar">
                {Object.entries(event.data).map(([key, value], index) => (
                  <div key={index} className="flex justify-between items-start">
                    <span className="text-muted-foreground">{`Param ${index + 1}:`}</span>
                    <span className="font-mono text-xs truncate max-w-[180px] text-right">
                      {typeof value === "object" ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
