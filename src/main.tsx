
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { enablePerformanceOptimizations, measureCoreWebVitals } from '@/utils/performanceOptimizations'
import { enableMobileOptimizations, optimizeImageLoading, preloadCriticalResources } from '@/utils/mobileOptimizations'

// Enable performance optimizations
enablePerformanceOptimizations();
enableMobileOptimizations();

// Measure performance
const vitals = measureCoreWebVitals();
console.log('Core Web Vitals:', vitals);

// Optimize loading
optimizeImageLoading();
preloadCriticalResources();

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
