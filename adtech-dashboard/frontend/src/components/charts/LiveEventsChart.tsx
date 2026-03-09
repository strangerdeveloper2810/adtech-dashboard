import { useRef, useEffect, useMemo, type FC, type JSX } from "react";
import echarts from "@/lib/echarts";
import type { LiveEventsChartProps } from "@/types";

const LiveEventsChart: FC<LiveEventsChartProps> = ({
  messages,
  height = 300,
}): JSX.Element => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  // Backend đã aggregate sẵn - chỉ cần format timestamp
  const chartData = useMemo(() => {
    return messages
      .map((msg) => ({
        // timestamp là Unix seconds → convert to Date
        time: new Date(msg.timestamp * 1000).toLocaleTimeString("en-US", {
          hour12: false,
        }),
        impressions: msg.impressions,
        clicks: msg.clicks,
        conversions: msg.conversions,
      }))
      .slice(-30); // Keep last 30 entries
  }, [messages]);

  const options = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["Impressions", "Clicks", "Conversions"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: chartData.map((item) => item.time),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Impressions",
          type: "line",
          smooth: true,
          data: chartData.map((item) => item.impressions),
          lineStyle: { color: "#1976d2" },
          itemStyle: { color: "#1976d2" },
        },
        {
          name: "Clicks",
          type: "line",
          smooth: true,
          data: chartData.map((item) => item.clicks),
          lineStyle: { color: "#f59e0b" },
          itemStyle: { color: "#f59e0b" },
        },
        {
          name: "Conversions",
          type: "line",
          smooth: true,
          data: chartData.map((item) => item.conversions),
          lineStyle: { color: "#16a34a" },
          itemStyle: { color: "#16a34a" },
        },
      ],
    }),
    [chartData],
  );

  // Initialize chart once
  useEffect(() => {
    if (!chartRef.current) return;

    chartInstanceRef.current = echarts.init(chartRef.current);

    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  // Update chart options when data changes (không re-init)
  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.setOption(options);
    }
  }, [options]);

  return <div ref={chartRef} style={{ height }} />;
};

export default LiveEventsChart;
