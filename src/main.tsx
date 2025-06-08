
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Lazy load the main App component
const App = React.lazy(() => import('./App.tsx'))

// Simple loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
        <svg className="w-6 h-6 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      </div>
      <p className="text-sm text-muted-foreground">Loading SimoneLabs...</p>
    </div>
  </div>
)

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoadingSpinner />}>
      <App />
    </React.Suspense>
  </React.StrictMode>
);

// Load performance optimizations after initial render
setTimeout(() => {
  import('@/utils/performanceOptimizations').then(({ enablePerformanceOptimizations, measureCoreWebVitals }) => {
    enablePerformanceOptimizations();
    const vitals = measureCoreWebVitals();
    console.log('Core Web Vitals:', vitals);
  });

  import('@/utils/mobileOptimizations').then(({ enableMobileOptimizations, optimizeImageLoading, preloadCriticalResources }) => {
    enableMobileOptimizations();
    optimizeImageLoading();
    preloadCriticalResources();
  });
}, 100);
