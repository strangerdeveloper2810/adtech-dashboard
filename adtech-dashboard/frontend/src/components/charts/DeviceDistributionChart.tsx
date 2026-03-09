import { useRef, useEffect, useMemo, type FC, type JSX } from "react";
import echarts from "@/lib/echarts";
import type { DeviceDistributionChartProps } from "@/types/component/charts";

const DEVICE_COLORS: Record<string, string> = {
  desktop: "#1976d2",
  mobile: "#16a34a",
  tablet: "#f59e0b",
};

const DeviceDistributionChart: FC<DeviceDistributionChartProps> = ({
  data,
  height = 250,
}): JSX.Element => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const options = useMemo(
    () => ({
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        right: 10,
        top: "center",
      },
      series: [
        {
          name: "Device",
          type: "pie",
          radius: ["40%", "70%"], // donut chart
          center: ["40%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: false,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: "bold",
            },
          },
          data: data.map((item) => ({
            name: item.device.charAt(0).toUpperCase() + item.device.slice(1),
            value: item.count,
            itemStyle: { color: DEVICE_COLORS[item.device] || "#7c3aed" },
          })),
        },
      ],
    }),
    [data],
  );

  useEffect(() => {
    if (!chartRef.current) return;

    chartInstanceRef.current = echarts.init(chartRef.current);

    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.setOption(options);
    }
  }, [options]);

  return <div ref={chartRef} style={{ height }} />;
};

export default DeviceDistributionChart;
