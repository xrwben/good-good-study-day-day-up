// 监控web-vitals指标
const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;

// 上报web-vitals指标
reportWebVitals(metric => {
  fetch('/api/report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: metric.name,       // 指标名，如 "LCP"
      value: metric.value,     // 指标值（毫秒）
      rating: metric.rating,   // "good" | "needs-improvement" | "poor"
      delta: metric.delta,     // 当前值与上次上报的差值
      id: metric.id,           // 唯一标识
      navigationType: metric.navigationType,
      url: window.location.href,
      timestamp: Date.now(),
    }),
  });
});