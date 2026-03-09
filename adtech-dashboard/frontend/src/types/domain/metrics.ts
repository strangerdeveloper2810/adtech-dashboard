interface MetricParams {
  campaignId: number;
  from: string;
  to: string;
  granularity?: "hourly" | "daily" | "weekly" | "monthly";
}

export type { MetricParams };
