type WebsocketStatus = "connecting" | "connected" | "disconnected" | "error";

// Backend sends pre-aggregated events
interface WebsocketMessage {
  type: "events_processed";
  impressions: number;
  clicks: number;
  conversions: number;
  count: number;
  timestamp: number; // Unix timestamp (seconds)
}

interface LiveEventStats {
  impressions: number;
  clicks: number;
  conversions: number;
  lastUpdated: string;
}

export type { WebsocketStatus, WebsocketMessage, LiveEventStats };
