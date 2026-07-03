import type { CampaignMetrics } from "../domain";
import type { WebsocketMessage } from "../socket/websocket";

interface PerformanceTrendChartProps {
  data: CampaignMetrics[];
  height?: number;
}

interface LiveEventsChartProps {
  messages: WebsocketMessage[];
  height?: number;
}

interface DeviceDistributionChartProps {
  data: { device: string; count: number }[];
  height?: number;
}

interface CountryTrafficChartProps {
  data: { country: string; count: number }[];
  height?: number;
}

export type {
  PerformanceTrendChartProps,
  LiveEventsChartProps,
  DeviceDistributionChartProps,
  CountryTrafficChartProps,
};
