import { useState, useEffect, useRef, useCallback } from 'react';

type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'error';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketOptions {
  onMessage?: (data: any) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 3000,
    reconnectAttempts = 5
  } = options;

  const [status, setStatus] = useState<WebSocketStatus>('closed');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Create WebSocket connection
  const connect = useCallback(() => {
    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    // Create new connection with proper path (/ws)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    setStatus('connecting');
    
    try {
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        setStatus('open');
        reconnectCountRef.current = 0;
        if (onOpen) onOpen();
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
          if (onMessage) onMessage(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      wsRef.current.onclose = () => {
        setStatus('closed');
        
        // Attempt reconnection if we haven't exceeded the limit
        if (reconnectCountRef.current < reconnectAttempts) {
          if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
          
          reconnectTimerRef.current = setTimeout(() => {
            reconnectCountRef.current += 1;
            connect();
          }, reconnectInterval);
        }
        
        if (onClose) onClose();
      };
      
      wsRef.current.onerror = (error) => {
        setStatus('error');
        if (onError) onError(error);
        
        // Close the connection on error to trigger reconnect
        if (wsRef.current) {
          wsRef.current.close();
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setStatus('error');
    }
  }, [onOpen, onMessage, onClose, onError, reconnectInterval, reconnectAttempts]);
  
  // Send a message through the WebSocket
  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);
  
  // Authenticate user
  const authenticate = useCallback((userId: number) => {
    return sendMessage({
      type: 'auth',
      userId
    });
  }, [sendMessage]);
  
  // Subscribe to workflow
  const subscribeToWorkflow = useCallback((workflowId: number) => {
    return sendMessage({
      type: 'subscribe',
      workflowId
    });
  }, [sendMessage]);
  
  // Unsubscribe from workflow
  const unsubscribeFromWorkflow = useCallback((workflowId: number) => {
    return sendMessage({
      type: 'unsubscribe',
      workflowId
    });
  }, [sendMessage]);
  
  // Connect on mount and disconnect on unmount
  useEffect(() => {
    connect();
    
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect]);
  
  return {
    status,
    lastMessage,
    sendMessage,
    authenticate,
    subscribeToWorkflow,
    unsubscribeFromWorkflow
  };
}

export default useWebSocket;