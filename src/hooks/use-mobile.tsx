
import * as React from "react"
import { isMobile, isTablet } from 'react-device-detect';

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobileState, setIsMobileState] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Use react-device-detect for initial detection
    const isDeviceMobile = isMobile || isTablet;
    
    // Fallback to window width check
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const isWindowMobile = window.innerWidth < MOBILE_BREAKPOINT;
      // Combine device detection with window size
      setIsMobileState(isDeviceMobile || isWindowMobile);
    }
    
    mql.addEventListener("change", onChange)
    onChange(); // Set initial state
    
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobileState
}
