
export const enablePerformanceOptimizations = () => {
  // Enable modern image formats
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // Optimize CSS delivery
  const optimizeCSS = () => {
    const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    stylesheets.forEach(stylesheet => {
      const link = stylesheet as HTMLLinkElement;
      link.media = 'print';
      link.onload = () => {
        link.media = 'all';
      };
    });
  };

  // Enable resource hints
  const enableResourceHints = () => {
    const criticalHosts = [
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];

    criticalHosts.forEach(host => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = `//${host}`;
      document.head.appendChild(link);
    });
  };

  // Optimize JavaScript execution
  const optimizeJS = () => {
    // Defer non-critical scripts
    const scripts = document.querySelectorAll('script[data-defer]');
    scripts.forEach(script => {
      const newScript = document.createElement('script');
      newScript.src = (script as HTMLScriptElement).src;
      newScript.defer = true;
      document.head.appendChild(newScript);
      script.remove();
    });
  };

  // Initialize optimizations
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeCSS();
      enableResourceHints();
      optimizeJS();
    });
  } else {
    optimizeCSS();
    enableResourceHints();
    optimizeJS();
  }

  return {
    supportsWebP: supportsWebP(),
    optimized: true
  };
};

export const measureCoreWebVitals = () => {
  const vitals = {
    LCP: 0, // Largest Contentful Paint
    FID: 0, // First Input Delay
    CLS: 0  // Cumulative Layout Shift
  };

  // Measure LCP
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1] as any;
    vitals.LCP = lastEntry.startTime;
  });
  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

  // Measure FID
  const fidObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      vitals.FID = entry.processingStart - entry.startTime;
    });
  });
  fidObserver.observe({ entryTypes: ['first-input'] });

  // Measure CLS
  let clsValue = 0;
  const clsObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    entries.forEach((entry: any) => {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
        vitals.CLS = clsValue;
      }
    });
  });
  clsObserver.observe({ entryTypes: ['layout-shift'] });

  return vitals;
};
