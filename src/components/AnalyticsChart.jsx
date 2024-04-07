import { forwardRef } from 'react';

const AnalyticsChart = forwardRef(function chart(
  { id, width, maxWidth, height, className = '', ...props },
  ref
) {
  return (
    <canvas
      id={`${id}`}
      className={`w-${width} md:max-w-${maxWidth} h-${height} border border-green-800 rounded-lg dark:bg-[#1C1917] bg-white ${className}`}
      {...props}
    />
  );
});

export default AnalyticsChart;
