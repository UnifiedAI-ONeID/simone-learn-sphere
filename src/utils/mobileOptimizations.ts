
export const enableMobileOptimizations = () => {
  // Disable hover effects on mobile
  if ('ontouchstart' in window) {
    document.documentElement.classList.add('touch-device');
  }

  // Optimize viewport for mobile apps
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  }

  // Add mobile app meta tags for app store
  const metaTags = [
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'apple-mobile-web-app-title', content: 'SimoneLabs' },
    { name: 'theme-color', content: '#6366f1' },
    { name: 'msapplication-TileColor', content: '#6366f1' },
  ];

  metaTags.forEach(tag => {
    let meta = document.querySelector(`meta[name="${tag.name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', tag.name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', tag.content);
  });

  // Prevent zoom on input focus for better UX
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      if (window.screen.width < 768) {
        document.body.style.zoom = '1';
      }
    });
  });

  // Enable passive listeners for better scroll performance
  const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
  passiveEvents.forEach(event => {
    document.addEventListener(event, () => {}, { passive: true });
  });

  // Add pull-to-refresh prevention for app-like feel
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchmove', handleTouchMove, { passive: false });

  let xDown: number | null = null;
  let yDown: number | null = null;

  function handleTouchStart(evt: TouchEvent) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  }

  function handleTouchMove(evt: TouchEvent) {
    if (!xDown || !yDown) {
      return;
    }

    const xUp = evt.touches[0].clientX;
    const yUp = evt.touches[0].clientY;

    const xDiff = xDown - xUp;
    const yDiff = yDown - yUp;

    // Prevent pull-to-refresh when scrolling down at the top
    if (Math.abs(yDiff) > Math.abs(xDiff) && yDiff < 0 && window.scrollY === 0) {
      evt.preventDefault();
    }

    xDown = null;
    yDown = null;
  }
};

export const optimizeImageLoading = () => {
  // Lazy load images with intersection observer
  const images = document.querySelectorAll('img[data-src]');
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src!;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  images.forEach(img => imageObserver.observe(img));

  // Preload critical images
  const criticalImages = [
    '/lovable-uploads/d6a21c1b-8b9b-4811-a5eb-eafac22bca5f.png',
    '/lovable-uploads/7a68d4b0-5778-4fc6-bd9d-8d45d0d83da0.png'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

export const preloadCriticalResources = () => {
  const criticalResources = [
    '/api/user',
    '/api/dashboard-metrics'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = resource;
    document.head.appendChild(link);
  });

  // Preload fonts for better performance
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
  ];

  fonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = font;
    document.head.appendChild(link);
  });
};

// App store specific optimizations
export const enableAppStoreOptimizations = () => {
  // Service worker for offline functionality
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);
        })
        .catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }

  // App install prompt handling
  let deferredPrompt: any;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  // Handle app installed event
  window.addEventListener('appinstalled', () => {
    console.log('SimoneLabs app was installed');
    deferredPrompt = null;
  });
};
