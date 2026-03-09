import { useRef, useState, useEffect } from "react";
import { WS } from "@/constants";
import type {
  WebsocketStatus,
  WebsocketMessage,
} from "@/types/socket/websocket";

const useWebSocket = (url: string = WS.METRICS_URL) => {
  const [status, setStatus] = useState<WebsocketStatus>("disconnected");
  const [messages, setMessages] = useState<WebsocketMessage[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      // Clear any pending reconnect timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      // Skip if already connected/connecting
      if (
        wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      if (!isMounted) return;

      setStatus("connecting");
      const ws = new WebSocket(url);

      ws.onopen = () => {
        if (isMounted) {
          setStatus("connected");
          reconnectAttemptRef.current = 0;
        }
      };

      ws.onclose = () => {
        if (!isMounted) return;

        setStatus("disconnected");

        // Auto reconnect with exponential backoff
        if (reconnectAttemptRef.current < WS.MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(
            WS.RECONNECT_INTERVAL * Math.pow(2, reconnectAttemptRef.current),
            WS.MAX_RECONNECT_DELAY,
          );
          reconnectAttemptRef.current++;

          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      };

      ws.onerror = () => {
        if (isMounted) setStatus("error");
      };

      ws.onmessage = (event) => {
        if (!isMounted) return;
        const data = JSON.parse(event.data) as WebsocketMessage;
        setMessages((prev) => [...prev, data]);
      };

      wsRef.current = ws;
    };

    connect();

    // Cleanup on unmount
    return () => {
      isMounted = false;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [url]); // Only re-run if url changes

  return { status, messages };
};

export default useWebSocket;
