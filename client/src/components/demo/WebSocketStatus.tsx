import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icons } from '@/lib/icons';
import useWebSocket from '@/hooks/use-websocket';

export function WebSocketStatus() {
  const [messages, setMessages] = useState<any[]>([]);
  
  const { status, lastMessage, sendMessage } = useWebSocket({
    onMessage: (data) => {
      // Keep last 5 messages only
      setMessages(prev => [data, ...prev].slice(0, 5));
    }
  });
  
  // Get badge color based on status
  const getBadgeColor = () => {
    switch(status) {
      case 'open': return 'bg-green-500 hover:bg-green-600';
      case 'connecting': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'error':
      case 'closed': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-slate-500 hover:bg-slate-600';
    }
  };
  
  // Send a ping message to test connection
  const handlePing = () => {
    sendMessage({
      type: 'ping',
      timestamp: new Date().toISOString()
    });
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">WebSocket Connection</CardTitle>
          <Badge className={getBadgeColor()}>
            {status}
          </Badge>
        </div>
        <CardDescription>
          Real-time communication status
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handlePing}
              disabled={status !== 'open'}
            >
              <Icons.send className="h-4 w-4 mr-2" />
              Send Ping
            </Button>
          </div>
          
          {messages.length > 0 ? (
            <div className="space-y-2 mt-4">
              <h4 className="text-sm font-medium">Recent Messages:</h4>
              <div className="bg-slate-50 p-3 rounded-md max-h-40 overflow-y-auto text-xs font-mono">
                {messages.map((msg, idx) => (
                  <div key={idx} className="mb-1 pb-1 border-b border-slate-200 last:border-0">
                    {JSON.stringify(msg)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500 mt-4">
              No messages received yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default WebSocketStatus;