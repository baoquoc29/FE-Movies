import React, { useEffect, useState, useRef } from "react";
import { Chart } from "react-google-charts";

const ResponsivePieChart = ({ data, options }) => {
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: '100%', height: '300px' });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      if (!entries || entries.length === 0) return;
      
      const { width, height } = entries[0].contentRect;
      setDimensions({
        width: `${width}px`,
        height: `${Math.min(height, width * 0.5)}px` // Giữ tỷ lệ biểu đồ
      });
    });

    if (chartRef.current) {
      resizeObserver.observe(chartRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div ref={chartRef} style={{ width: '100%', height: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <Chart
        chartType="PieChart"
        data={data}
        options={options}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
};

export default ResponsivePieChart;