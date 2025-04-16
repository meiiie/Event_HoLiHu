import * as React from "react"
import { cn } from "@/lib/utils"
import { formatTimeAgo, formatEventName } from "@/lib/utils"
import type { BlockchainEvent } from "@/lib/supabase"
import { ExternalLink, ChevronRight, Copy, Info, Tag } from "lucide-react"
import { Badge } from "./badge"
import { Button } from "./button"
import { useToast } from "@/hooks/use-toast"
import { getTransactionUrl } from "@/lib/contract-addresses"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  const [isExpanded, setIsExpanded] = React.useState(expanded)
  const [isRotated, setIsRotated] = React.useState(expanded)
  const [isVisible, setIsVisible] = React.useState(false)
  
  React.useEffect(() => {
    setIsExpanded(expanded)
    setIsRotated(expanded)
    if (expanded) {
      setIsVisible(true)
    }
  }, [expanded])
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${label} has been copied to your clipboard`,
      duration: 3000,
    })
  }
  
  const handleTransitionEnd = () => {
    if (!isExpanded) {
      setIsVisible(false)
    }
  }

  // Format event data for better display
  const formatEventData = (data: any): { key: string, value: string }[] => {
    if (!data || typeof data !== 'object') return [];
    
    return Object.entries(data).map(([key, value], index) => {
      // Try to guess parameter names based on EntryPoint events
      let paramName = `Param ${index + 1}`;
      
      // Event-specific parameter naming
      if (event.event_name === 'ThaoTacNguoiDungDuocThucThi' || 
          event.event_name === 'ThucThiThaoTac') {
        if (index === 0) paramName = 'Sender';
        else if (index === 1 && event.event_name === 'ThaoTacNguoiDungDuocThucThi') paramName = 'Nonce';
        else if ((index === 1 && event.event_name === 'ThucThiThaoTac') || 
                 (index === 2 && event.event_name === 'ThaoTacNguoiDungDuocThucThi')) paramName = 'Success';
        else if (index === 2 && event.event_name === 'ThucThiThaoTac') paramName = 'Gas Used';
      } else if (event.event_name === 'PaymasterXacThucThanhCong') {
        if (index === 0) paramName = 'Paymaster';
        else if (index === 1) paramName = 'Sender';
      } else if (event.event_name === 'TaoNguoiGuiThanhCong') {
        if (index === 0) paramName = 'Created Address';
        else if (index === 1) paramName = 'Gas Used';
      } else if (event.event_name === 'PostOpThatBai') {
        if (index === 0) paramName = 'Paymaster';
        else if (index === 1) paramName = 'Nonce';
        else if (index === 2) paramName = 'Reason';
      }
      
      // Format value based on type
      let displayValue = '';
      if (typeof value === 'boolean') {
        displayValue = value ? 'True' : 'False';
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value);
      } else {
        displayValue = String(value);
      }
      
      return { 
        key: paramName, 
        value: displayValue
      };
    });
  };
  
  const formattedData = formatEventData(event.data);
  
  return (
    <div
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
          <div
            className={cn(
              "transform transition-transform duration-200",
              isRotated ? "rotate-90" : "rotate-0"
            )}
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      {(isExpanded || isVisible) && (
        <div
          className={cn(
            "mt-4 pt-4 border-t text-sm overflow-hidden transition-all duration-200",
            isExpanded ? "opacity-100 max-h-[800px]" : "opacity-0 max-h-0"
          )}
          onTransitionEnd={handleTransitionEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Transaction Details</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Contract:</span>
                  <div className="flex items-center">
                    <span className="font-medium">{event.contract_name}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Block:</span>
                  <div className="flex items-center">
                    <span className="font-mono">{event.block_number}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(event.block_number.toString(), "Block number");
                      }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(event.transaction_hash, "Transaction hash");
                      }}
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
                onClick={(e) => e.stopPropagation()}
              >
                View on Explorer
                <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Event Data</h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 styled-scrollbar">
                {formattedData.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center">
                            <span className="text-muted-foreground">{item.key}:</span>
                            <Info className="h-3 w-3 ml-1 text-muted-foreground/50 cursor-help" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Parameter {index} of {event.event_name} event</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <span className="font-mono text-xs truncate max-w-[180px] text-right">
                      {/* Format based on value type */}
                      {item.value.startsWith('0x') ? (
                        <Badge variant="outline" className="font-mono">
                          {item.value.length > 10 ? 
                            `${item.value.substring(0, 6)}...${item.value.substring(item.value.length - 4)}` : 
                            item.value}
                        </Badge>
                      ) : (
                        item.value
                      )}
                    </span>
                  </div>
                ))}

                {formattedData.length === 0 && (
                  <div className="text-center py-2 text-muted-foreground">
                    No data parameters available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
