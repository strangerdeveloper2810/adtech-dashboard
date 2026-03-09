import { useRef, useEffect, useMemo, type FC, type JSX } from "react";
import echarts from "@/lib/echarts";
import type { PerformanceTrendChartProps } from "@/types";

const PerformanceTrendChart: FC<PerformanceTrendChartProps> = ({
  data,
  height,
}): JSX.Element => {
  const chartRef = useRef<HTMLDivElement>(null);

  const options = useMemo(
    () => ({
      // tooltip
      tooltip: {
        trigger: "axis", // hiện tooltip cho cả trục X (tất cả lines cùng lúc)
      },

      //   legend: chú thích lines
      legend: {
        data: ["Impressions", "Clicks", "Conversions"],
      },
      //    Grid — padding chart area
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true, // đảm bảo labels không bị cắt
      },
      // 4. X Axis — trục ngang (period/time)
      xAxis: {
        type: "category",
        data: data.map((item) => item.period), // ['2024-01-01', '2024-01-02', ...]
      },
      // 5. Y Axis — trục dọc (values)
      yAxis: {
        type: "value",
      },
      // 6. Series — các đường line
      series: [
        {
          name: "Impressions",
          type: "line",
          data: data.map((item) => item.impressions),
        },
        {
          name: "Clicks",
          type: "line",
          data: data.map((item) => item.clicks),
        },
        {
          name: "Conversions",
          type: "line",
          data: data.map((item) => item.conversions),
        },
      ],
    }),

    [data],
  );

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    chart.setOption(options);

    // cleanup khi unmoint
    return () => chart.dispose();
  }, [options]);
  return <div ref={chartRef} style={{ height }}></div>;
};

export default PerformanceTrendChart;
