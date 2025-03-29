import { useEffect, useRef, useState, useCallback } from 'react';

type WebSocketStatus = 'connecting' | 'open' | 'closed' | 'error';

interface WebSocketEventMap {
  open: Event;
  message: MessageEvent;
  close: CloseEvent;
  error: Event;
}

interface UseWebSocketOptions {
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onMessage?: (data: any, event: WebSocketEventMap['message']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
  autoReconnect?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [status, setStatus] = useState<WebSocketStatus>('connecting');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = options.reconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;
  const autoReconnect = options.autoReconnect !== false;
  
  // Create a WebSocket connection with the correct protocol and path
  const connect = useCallback(() => {
    try {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log(`Connecting to WebSocket at ${wsUrl}...`);
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      socket.onopen = (event) => {
        console.log('WebSocket connection established');
        setStatus('open');
        reconnectAttemptsRef.current = 0;
        options.onOpen?.(event);
      };
      
      socket.onmessage = (event) => {
        let parsedData;
        try {
          parsedData = JSON.parse(event.data);
          setLastMessage(parsedData);
          options.onMessage?.(parsedData, event);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          options.onMessage?.(event.data, event);
        }
      };
      
      socket.onclose = (event) => {
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
        setStatus('closed');
        options.onClose?.(event);
        
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Attempting to reconnect (${reconnectAttemptsRef.current}/${maxReconnectAttempts})...`);
          
          if (reconnectTimeoutRef.current) {
            window.clearTimeout(reconnectTimeoutRef.current);
          }
          
          // Use exponential backoff for reconnection attempts
          const delay = reconnectInterval * Math.pow(1.5, reconnectAttemptsRef.current - 1);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            console.log(`Reconnecting after ${delay}ms delay...`);
            connect();
          }, delay);
        }
      };
      
      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setStatus('error');
        options.onError?.(event);
      };
      
      return socket;
    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setStatus('error');
      return null;
    }
  }, [
    options,
    autoReconnect,
    maxReconnectAttempts,
    reconnectInterval
  ]);
  
  // Send a message through the WebSocket
  const sendMessage = useCallback((data: any) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      console.error('Cannot send message, WebSocket is not connected');
      return false;
    }
    
    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      socketRef.current.send(message);
      return true;
    } catch (err) {
      console.error('Error sending WebSocket message:', err);
      return false;
    }
  }, []);
  
  // Send a ping to keep the connection alive
  const sendPing = useCallback(() => {
    return sendMessage({ type: 'ping' });
  }, [sendMessage]);
  
  // Manually reconnect the WebSocket
  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    
    if (reconnectTimeoutRef.current) {
      window.clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setStatus('connecting');
    connect();
  }, [connect]);
  
  // Authenticate with the WebSocket server
  const authenticate = useCallback((userId: number) => {
    return sendMessage({
      type: 'auth',
      userId
    });
  }, [sendMessage]);
  
  // Subscribe to updates for a specific workflow
  const subscribeToWorkflow = useCallback((workflowId: number | string) => {
    return sendMessage({
      type: 'subscribe',
      workflowId
    });
  }, [sendMessage]);
  
  // Execute a workflow through WebSocket
  const executeWorkflow = useCallback((workflowId: number | string, nodes: any[], testName?: string) => {
    return sendMessage({
      type: 'workflow_execute',
      workflowId,
      nodes,
      testName
    });
  }, [sendMessage]);
  
  // Initialize the WebSocket connection
  useEffect(() => {
    const socket = connect();
    
    // Keep connection alive with periodic pings
    const pingInterval = window.setInterval(() => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        sendPing();
      }
    }, 30000); // 30 seconds
    
    return () => {
      window.clearInterval(pingInterval);
      
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (socket) {
        socket.close();
      }
    };
  }, [connect, sendPing]);
  
  return {
    status,
    lastMessage,
    sendMessage,
    reconnect,
    authenticate,
    subscribeToWorkflow,
    executeWorkflow
  };
}