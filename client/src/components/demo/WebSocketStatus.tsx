import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Signal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WebSocketStatusProps {
  status: 'connecting' | 'open' | 'closed' | 'error';
  onReconnect?: () => void;
}

export default function WebSocketStatus({ status, onReconnect }: WebSocketStatusProps) {
  let icon;
  let color;
  let text;
  let description;
  
  switch (status) {
    case 'connecting':
      icon = <Signal className="h-5 w-5 animate-pulse" />;
      color = "text-yellow-500";
      text = "Connecting...";
      description = "Establishing WebSocket connection";
      break;
    case 'open':
      icon = <CheckCircle className="h-5 w-5" />;
      color = "text-green-500";
      text = "Connected";
      description = "Real-time connection is established";
      break;
    case 'closed':
      icon = <XCircle className="h-5 w-5" />;
      color = "text-gray-500";
      text = "Disconnected";
      description = "WebSocket connection is closed";
      break;
    case 'error':
      icon = <XCircle className="h-5 w-5" />;
      color = "text-red-500";
      text = "Connection Error";
      description = "Failed to establish WebSocket connection";
      break;
  }
  
  return (
    <div className="flex items-center space-x-2 rounded-md border p-2 shadow-sm">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`flex items-center ${color}`}>
              {icon}
              <span className="ml-1.5 text-sm font-medium hidden md:inline">{text}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {(status === 'closed' || status === 'error') && onReconnect && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={onReconnect}
          title="Reconnect"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="ml-1 text-xs hidden md:inline">Reconnect</span>
        </Button>
      )}
    </div>
  );
}