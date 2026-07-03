import { useRef, useEffect, useMemo, type FC, type JSX } from "react";
import echarts from "./echarts";
import type { CountryTrafficChartProps } from "@adtech/types";

const CountryTrafficChart: FC<CountryTrafficChartProps> = ({
  data,
  height = 300,
}): JSX.Element => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  const options = useMemo(
    () => ({
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data.map((item) => item.country),
        axisLabel: {
          rotate: 0,
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Traffic",
          type: "bar",
          data: data.map((item) => item.count),
          itemStyle: {
            color: "#1976d2",
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: "#1565c0",
            },
          },
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

export default CountryTrafficChart;
